export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const host = req.headers.host || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const serverUrl = `${protocol}://${host}`;

  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Agent Skills API",
      description: "API for fetching Agent Skills (SKILL.md) dynamically into ChatGPT Custom GPT Actions",
      version: "1.0.0"
    },
    servers: [
      {
        url: serverUrl,
        description: "Dynamic server URL"
      }
    ],
    paths: {
      "/api/skills": {
        get: {
          operationId: "listSkills",
          summary: "List all available skills with their names and descriptions",
          responses: {
            "200": {
              description: "A list of skills",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      total: { type: "integer" },
                      skills: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            slug: { type: "string" },
                            description: { type: "string" }
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
      "/api/read-skill": {
        get: {
          operationId: "readSkill",
          summary: "Read full SKILL.md definition for a given skill slug or name",
          parameters: [
            {
              name: "slug",
              in: "query",
              required: true,
              description: "The slug name of the skill (e.g. font-craft, ljg-think)",
              schema: {
                type: "string"
              }
            }
          ],
          responses: {
            "200": {
              description: "Skill details and full content",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      slug: { type: "string" },
                      description: { type: "string" },
                      content: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  return res.status(200).json(spec);
}
