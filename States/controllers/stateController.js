const State = require("../model/States");


 const getAllStates = async (req, res) => {
   
    const { contig } = req.query;

    let states = require('../data/states.json');
  
    if (contig === 'true') {
      states = states.filter((state) => !['AK', 'HI'].includes(state.code));
    } else if (contig === 'false') {
      states = states.filter((state) => ['AK', 'HI'].includes(state.code));
    }
  
    const statesWithFunFacts = await State.find();
  
    states.forEach((state) => {
      const stateWithFunFact = statesWithFunFacts.find((s) => s.code === state.code);
      if (stateWithFunFact) {
        state.funfact = stateWithFunFact.funfacts[Math.floor(Math.random() * stateWithFunFact.funfacts.length)];
      }
    });
  
    res.json(states);
  };


const getState = async (req, res) => {

    const state = require('../data/states.json').find((s) => s.code === req.params.state);
  
    if (!state) {
      res.status(404).send(`State ${req.params.state} not found`);
      return;
    }
  
    const stateWithFunFacts = await State.findOne({ code: req.params.state });
  
    if (stateWithFunFacts) {
      state.funfact = stateWithFunFacts.funfacts[Math.floor(Math.random() * stateWithFunFacts.funfacts.length)];
    }
  
    res.json(state);
  };

const getRandomFunFact = async (req, res) => {

    const stateWithFunFacts = await State.findOne({ code: req.params.state });
    
    if (!stateWithFunFacts || stateWithFunFacts.funfacts.length === 0) {
      res.status(404).send(`No fun facts found for state ${req.params.state}`);
      return;
    }
    
    const funFact = stateWithFunFacts.funfacts[Math.floor(Math.random() * stateWithFunFacts.funfacts.length)];

    res.json(funFact);
  };

const getCapital = (req, res) => {
    const state = require('../data/states.json').find((s) => s.code === req.params.state);
    
    if (!state) {
      res.status(404).send(`State ${req.params.state} not found`);
      return;
    }
  
    const capitalObject = { state: state.name, capital: state.capital };
    
    res.json(capitalObject);
  };


const getNickname = (req, res) => {
    const state = require('../data/states.json').find((s) => s.code === req.params.state);
    if (!state) {
      res.status(404).send(`State ${req.params.state} not found`);
      return;
    }
    res.json({ state: state.name, nickname: state.nickname });
  };


const getAdmission = (req, res) => {
    const state = require('../data/states.json').find((s) => s.code === req.params.state);
  
    if (!state) {
      res.status(404).send(`State ${req.params.state} not found`);
      return;
    }
  
    const admission = state.admission;

    if (!admission) {
      res.status(404).send(`No admission date found for ${state.name}`);
      return;
    }

    const admissionDate = new Date(admission);
    res.status(200).json({ state: state.name, admitted: admissionDate.toISOString() });
  };

const getPopulation = (req, res) => {
    
    const state = require('../data/states.json').find((s) => s.code === req.params.state);
    
    if (!state) {
      res.status(404).send(`State ${req.params.state} not found`);
      return;
    }

    res.json({ state: state.name, population: state.population });
  };


module.exports = {
  getAllStates,
  getState,
  getRandomFunFact,
  getCapital,
  getNickname,
  getAdmission,
  getPopulation,
};