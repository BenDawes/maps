const drawCanvas = require("./draw-canvas.js");
const drawError = require("./draw-error.js");

exports.handler = async (event, context, metrics) => {
  let stripped;
  try {
    const query = (event && event.multiValueQueryStringParameters) || {};
    const path = event.rawPath || event.path;
    const canvas = await drawCanvas(path, query, metrics);
    const data = canvas.toDataURL("image/jpeg", { quality: 0.95 });
    stripped = data.replace(/^data:image\/\w+;base64,/, "");
  } catch (err) {
    const canvas = await drawError(err.message);
    const data = canvas.toDataURL("image/jpeg", { quality: 0.95 });
    stripped = data.replace(/^data:image\/\w+;base64,/, "");
  }

  return {
    statusCode: 200,
    headers: {
      "content-type": "image/jpeg",
    },
    body: stripped,
    isBase64Encoded: true,
  };
};
