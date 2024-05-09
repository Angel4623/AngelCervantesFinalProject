const express = require("express");
const router = express();
const stateController = require("../../controllers/stateController");

router
  .route("/")
  .get(stateController.getAllStates)
  .get(stateController.getState)
  .get(stateController.getRandomFunFact)
  .get(stateController.getCapital)
  .get(stateController.getNickname)
  .get(stateController.getAdmission)
  .get(stateController.getPopulation)
  .post(stateController.addFunFacts)
  .delete(stateController.deleteFunFact);

router.route("/:id").get(stateController.getAllStates);

module.exports = router;