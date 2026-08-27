export function buildOpenApiSpec(serverUrl) {
  return {
    openapi: '3.1.0',
    info: {
      title: 'Agent Skills API',
      description: 'Read ordinary Agent Skill bundles, compile private Learning Contracts at chat time, and persist evidence-based learner state for ChatGPT Custom GPT Actions',
      version: '3.0.1'
    },
    servers: [{ url: serverUrl, description: 'Dynamic server URL' }],
    paths: {
      '/api/skills': {
        get: {
          operationId: 'listSkills',
          'x-openai-isConsequential': false,
          summary: 'List available Skills with names, slugs, and descriptions',
          responses: {
            200: {
              description: 'Available Skills',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      total: { type: 'integer' },
                      skills: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            name: { type: 'string' },
                            slug: { type: 'string' },
                            description: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/read-skill': {
        get: {
          operationId: 'readSkill',
          'x-openai-isConsequential': false,
          summary: 'Read the complete SKILL.md entrypoint for one Skill',
          parameters: [
            {
              name: 'slug', in: 'query', required: true,
              description: 'Skill slug returned by listSkills',
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: {
              description: 'Skill metadata and SKILL.md content',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      slug: { type: 'string' },
                      description: { type: 'string' },
                      content: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/skill-files': {
        get: {
          operationId: 'listSkillFiles',
          'x-openai-isConsequential': false,
          summary: 'List files in a Skill bundle before reading relevant resources',
          parameters: [
            { name: 'slug', in: 'query', required: true, schema: { type: 'string' } },
            {
              name: 'prefix', in: 'query', required: false,
              description: 'Optional relative prefix such as references/ or chapters/',
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: {
              description: 'Bounded file inventory; files marked readable can be fetched as text',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      slug: { type: 'string' },
                      prefix: { type: 'string' },
                      files: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            path: { type: 'string' },
                            size: { type: 'integer' },
                            readable: { type: 'boolean' }
                          }
                        }
                      },
                      truncated: { type: 'boolean' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/read-skill-file': {
        get: {
          operationId: 'readSkillFile',
          'x-openai-isConsequential': false,
          summary: 'Read a safe, paginated text file from a Skill bundle',
          parameters: [
            { name: 'slug', in: 'query', required: true, schema: { type: 'string' } },
            {
              name: 'path', in: 'query', required: true,
              description: 'Relative path returned by listSkillFiles',
              schema: { type: 'string' }
            },
            {
              name: 'start_line', in: 'query', required: false,
              schema: { type: 'integer', minimum: 1, default: 1 }
            },
            {
              name: 'line_count', in: 'query', required: false,
              schema: { type: 'integer', minimum: 1, maximum: 800, default: 300 }
            }
          ],
          responses: {
            200: {
              description: 'Requested line window and pagination metadata',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      slug: { type: 'string' },
                      path: { type: 'string' },
                      start_line: { type: 'integer' },
                      end_line: { type: 'integer' },
                      total_lines: { type: 'integer' },
                      has_more: { type: 'boolean' },
                      content: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/learning-contract': {
        get: {
          operationId: 'getLearningContract',
          'x-openai-isConsequential': false,
          summary: 'Load the private dynamic Learning Contract for an ordinary Skill',
          description: 'Call after reading the Skill. If found=false, or revision_matches=false, generate a fresh capability graph from the Skill bundle and call updateLearningContract before loading learner state.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'skill', in: 'query', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: {
              description: 'Current source revision plus the stored contract, if any',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LearningContractRead' }
                }
              }
            },
            401: { description: 'Missing or invalid Bearer token' },
            404: { description: 'Skill not found' }
          }
        },
        put: {
          operationId: 'updateLearningContract',
          'x-openai-isConsequential': false,
          summary: 'Create or replace a private Learning Contract compiled from a Skill',
          description: 'Use the exact source_revision returned by getLearningContract. On update, pass its ETag as expected_etag. Nodes must be observable capabilities with valid source anchors and an acyclic prerequisite graph.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LearningContractUpdate' }
              }
            }
          },
          responses: {
            200: {
              description: 'Saved contract and new ETag',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      saved: { type: 'boolean' },
                      contract: { $ref: '#/components/schemas/LearningContract' },
                      etag: { type: 'string' }
                    }
                  }
                }
              }
            },
            401: { description: 'Missing or invalid Bearer token' },
            409: { description: 'Contract ETag or source revision conflict; reload before retrying' },
            422: { description: 'Contract is structurally invalid' }
          }
        }
      },
      '/api/learner-state': {
        get: {
          operationId: 'getLearnerState',
          'x-openai-isConsequential': false,
          summary: 'Load private learner state for an ordinary Skill with a Learning Contract',
          description: 'Call only after getLearningContract confirms a current contract. A missing or stale contract must be generated first.',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'skill', in: 'query', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: {
              description: 'Current state and ETag, or found=false when no state exists',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LearnerStateRead' }
                }
              }
            },
            401: { description: 'Missing or invalid Bearer token' },
            409: { description: 'Learning Contract is stale' },
            422: { description: 'Learning Contract has not been generated' }
          }
        },
        put: {
          operationId: 'updateLearnerState',
          'x-openai-isConsequential': false,
          summary: 'Replace learner state using evidence and optimistic concurrency',
          description: 'Call getLearningContract, then getLearnerState first. For existing state, pass its ETag as expected_etag. Never raise mastery from self-report alone.',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LearnerStateUpdate' }
              }
            }
          },
          responses: {
            200: {
              description: 'Saved state and new ETag',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      saved: { type: 'boolean' },
                      state: { $ref: '#/components/schemas/LearnerState' },
                      etag: { type: 'string' }
                    }
                  }
                }
              }
            },
            401: { description: 'Missing or invalid Bearer token' },
            409: { description: 'State or Skill revision conflict; reload before retrying' },
            422: { description: 'State is invalid or unsupported by evidence' }
          }
        }
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer' }
      },
      schemas: {
        SourceAnchor: {
          type: 'object',
          required: ['file', 'concept'],
          properties: {
            file: { type: 'string' },
            concept: { type: 'string' }
          }
        },
        MasteryRubric: {
          type: 'object',
          required: ['0', '1', '2', '3', '4'],
          properties: {
            '0': { type: 'string' },
            '1': { type: 'string' },
            '2': { type: 'string' },
            '3': { type: 'string' },
            '4': { type: 'string' }
          }
        },
        ContractNode: {
          type: 'object',
          required: [
            'id', 'title', 'stage', 'capability', 'prerequisites', 'source_anchors',
            'weaknesses', 'mastery', 'diagnose', 'challenge'
          ],
          properties: {
            id: { type: 'string', pattern: '^[a-z0-9][a-z0-9._-]{0,127}$' },
            title: { type: 'string' },
            stage: {
              type: 'string',
              enum: ['prerequisite', 'core', 'advanced', 'application']
            },
            capability: { type: 'string' },
            prerequisites: { type: 'array', items: { type: 'string' } },
            source_anchors: {
              type: 'array',
              minItems: 1,
              items: { $ref: '#/components/schemas/SourceAnchor' }
            },
            weaknesses: { type: 'array', items: { type: 'string' } },
            mastery: { $ref: '#/components/schemas/MasteryRubric' },
            diagnose: {
              type: 'object',
              required: ['prompt_pattern', 'signals'],
              properties: {
                prompt_pattern: { type: 'string' },
                signals: {
                  type: 'object',
                  required: ['strong', 'weak'],
                  properties: {
                    strong: { type: 'array', items: { type: 'string' } },
                    weak: { type: 'array', items: { type: 'string' } }
                  }
                }
              }
            },
            challenge: {
              type: 'object',
              required: ['task_pattern', 'novelty_constraints'],
              properties: {
                task_pattern: { type: 'string' },
                novelty_constraints: {
                  type: 'array',
                  minItems: 1,
                  items: { type: 'string' }
                }
              }
            }
          }
        },
        LearningContract: {
          type: 'object',
          required: ['schema_version', 'skill', 'source_revision', 'outcomes', 'nodes'],
          properties: {
            schema_version: { type: 'integer', const: 1 },
            skill: { type: 'string' },
            source_revision: { type: 'string' },
            outcomes: { type: 'array', minItems: 1, items: { type: 'string' } },
            nodes: {
              type: 'array',
              minItems: 1,
              maxItems: 500,
              items: { $ref: '#/components/schemas/ContractNode' }
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        LearningContractRead: {
          type: 'object',
          properties: {
            found: { type: 'boolean' },
            skill: { type: 'string' },
            source_revision: { type: 'string' },
            revision_matches: { type: 'boolean' },
            contract: {
              oneOf: [
                { $ref: '#/components/schemas/LearningContract' },
                { type: 'null' }
              ]
            },
            etag: { type: ['string', 'null'] }
          }
        },
        LearningContractUpdate: {
          type: 'object',
          required: ['schema_version', 'skill', 'source_revision', 'outcomes', 'nodes'],
          properties: {
            schema_version: { type: 'integer', const: 1 },
            skill: { type: 'string' },
            source_revision: { type: 'string' },
            outcomes: { type: 'array', minItems: 1, items: { type: 'string' } },
            nodes: {
              type: 'array',
              minItems: 1,
              maxItems: 500,
              items: { $ref: '#/components/schemas/ContractNode' }
            },
            expected_etag: { type: ['string', 'null'] }
          }
        },
        Evidence: {
          type: 'object',
          required: ['kind', 'result', 'response_summary', 'recorded_at'],
          properties: {
            kind: {
              type: 'string',
              enum: ['diagnostic', 'explanation', 'application', 'transfer', 'retrieval']
            },
            result: { type: 'string', enum: ['pass', 'partial', 'fail'] },
            response_summary: { type: 'string' },
            recorded_at: { type: 'string', format: 'date-time' }
          }
        },
        NodeState: {
          type: 'object',
          required: ['mastery', 'evidence', 'weaknesses'],
          properties: {
            mastery: { type: 'integer', minimum: 0, maximum: 4 },
            evidence: { type: 'array', items: { $ref: '#/components/schemas/Evidence' } },
            weaknesses: { type: 'array', items: { type: 'string' } },
            last_retrieved_at: { type: ['string', 'null'], format: 'date-time' },
            next_review_at: { type: ['string', 'null'], format: 'date-time' }
          }
        },
        PendingQuestion: {
          type: 'object',
          required: ['question_id', 'prompt_summary', 'asked_at'],
          properties: {
            question_id: { type: 'string' },
            prompt_summary: { type: 'string' },
            asked_at: { type: 'string', format: 'date-time' }
          }
        },
        Session: {
          type: 'object',
          required: ['current_node', 'phase', 'pending_question'],
          properties: {
            current_node: { type: ['string', 'null'] },
            phase: {
              type: 'string',
              enum: ['idle', 'diagnose', 'route', 'learn', 'challenge', 'retrieval']
            },
            pending_question: {
              oneOf: [
                { $ref: '#/components/schemas/PendingQuestion' },
                { type: 'null' }
              ]
            }
          }
        },
        LearnerState: {
          type: 'object',
          properties: {
            schema_version: { type: 'integer', const: 1 },
            learner_id: { type: 'string' },
            skill: { type: 'string' },
            skill_revision: { type: 'string' },
            session: { $ref: '#/components/schemas/Session' },
            nodes: {
              type: 'object',
              additionalProperties: { $ref: '#/components/schemas/NodeState' }
            },
            suggested_next: { type: ['string', 'null'] },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        LearnerStateRead: {
          type: 'object',
          properties: {
            found: { type: 'boolean' },
            learner_id: { type: 'string' },
            skill: { type: 'string' },
            skill_revision: { type: 'string' },
            revision_matches: { type: 'boolean' },
            state: {
              oneOf: [
                { $ref: '#/components/schemas/LearnerState' },
                { type: 'null' }
              ]
            },
            etag: { type: ['string', 'null'] }
          }
        },
        LearnerStateUpdate: {
          type: 'object',
          required: ['skill', 'skill_revision', 'session', 'nodes'],
          properties: {
            skill: { type: 'string' },
            skill_revision: { type: 'string' },
            session: { $ref: '#/components/schemas/Session' },
            nodes: {
              type: 'object',
              additionalProperties: { $ref: '#/components/schemas/NodeState' }
            },
            suggested_next: { type: ['string', 'null'] },
            expected_etag: { type: ['string', 'null'] }
          }
        }
      }
    }
  };
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', code: 'method_not_allowed' });
  }

  const host = req.headers.host || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return res.status(200).json(buildOpenApiSpec(`${protocol}://${host}`));
}
