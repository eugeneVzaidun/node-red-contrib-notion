module.exports = function (RED) {
  function AppendBlockChildrenNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    this.integration = RED.nodes.getNode(config.integration);
    node.on("input", async function (msg) {
      node.status({ fill: "gray", shape: "dot", text: "Starting" });
      try {
        const response = await this.integration.notion.blocks.children.append({
          block_id: msg.blockId,
          children: msg.payload.children,
        });

        msg.payload = response;

        // Check the response status
        if (response.object === "list") {
          node.status({ fill: "green", shape: "dot", text: "Done" });
        } else {
          msg.statusCode = response.status;
          node.status({
            fill: "red",
            shape: "dot",
            text: response.code || "API Error",
          });
        }
        node.send(msg);
      } catch (error) {
        msg.error = `Unexpected error: ${error.message}`;
        node.status({ fill: "red", shape: "dot", text: "Error" });
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType("append block children", AppendBlockChildrenNode);
};
