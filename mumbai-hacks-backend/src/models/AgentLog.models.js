import mongoose from "mongoose";

const AgentLogSchema = new mongoose.Schema({
  agentId: String,
  action: String,
  details: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
  requestId: String,
});

export default mongoose.model("AgentLog", AgentLogSchema);
