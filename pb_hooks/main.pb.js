/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/{path...}", $apis.static("./pb_public", true));

onRecordValidate((e) => {
  if (!e.record) {
    e.next();
    return;
  }

  const { models } = require(__hooks + "/lib/index.cjs");
  const collection = e.record.collection().name;
  const model = models[collection];
  if (!model) {
    e.next();
    return;
  }

  const value = JSON.parse(e.record.get("value"));
  try {
    model.parse(value);
  } catch (error) {
    throw new ValidationError();
  }

  e.next();
});
