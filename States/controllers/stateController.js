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

  const addFunFacts = async (req, res) => {
    const stateCode = req.params.state;
    const funFacts = req.body.funfacts;
  
    try {
      const state = await State.findOne({ stateCode });
  
      if (!state) {
        return res.status(404).json({ error: 'State not found' });
      }
  
      if (!Array.isArray(funFacts)) {
        return res.status(400).json({ error: 'Fun facts must be an array' });
      }
  
      state.funfacts = state.funfacts || [];
  
      state.funfacts.push(...funFacts);
  
      await state.save();
  
      return res.status(201).json(state);
    } 
    catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };

  const deleteFunFact = async (req, res) => {
    const stateCode = req.params.state;
    const { index } = req.body;

    try {
      const state = await State.findOne({ stateCode });
      if (!state) {
        return res.status(404).json({ error: 'State not found' });
      }
      const funFacts = state.funFacts.filter((fact, i) => i !== (index - 1));
      if (funFacts.length === state.funFacts.length) {
        return res.status(404).json({ error: 'Fun fact not found at index' });
      }
      state.funFacts = funFacts;
      await state.save();
      return res.status(200).json(state);
    } 
    
    catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  };

module.exports = {
  getAllStates,
  getState,
  getRandomFunFact,
  getCapital,
  getNickname,
  getAdmission,
  getPopulation,
  addFunFacts,
  deleteFunFact
};