export default function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  // Always log full error server-side
  console.error(err);
  res.status(status).json({
    requestId: req.id,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
}
