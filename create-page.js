module.exports = function (RED) {
  function CreatePageNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    this.integration = RED.nodes.getNode(config.integration);

    node.on("input", async function (msg) {
      node.status({ fill: "gray", shape: "dot", text: "Starting" });
      try {
        const response = await this.integration.notion.pages.create(
          msg.payload
        );

        msg.payload = response;

        if (response.object === "page") {
          node.status({ fill: "green", shape: "dot", text: "Done" });
        } else {
          node.status({ fill: "red", shape: "dot", text: "Error" });
        }
        node.send(msg);
      } catch (error) {
        msg.error = `Unexpected error: ${error.message}`;
        node.status({ fill: "red", shape: "dot", text: "Error" });
        node.send(msg);
      }
    });
  }
  RED.nodes.registerType("create page", CreatePageNode);
};
