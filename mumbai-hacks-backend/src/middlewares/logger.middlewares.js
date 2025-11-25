import pino from "pino-http";

const logger = pino({
  transport: { target: "pino-pretty" },
  serializers: {
    req(req) {
      return { id: req.id, method: req.method, url: req.url };
    },
  },
});

export default logger;
