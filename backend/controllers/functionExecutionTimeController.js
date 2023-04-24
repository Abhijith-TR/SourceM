'use strict';

const firestore = require('../db');
const Function = require('../models/function');


const addFunctionExecutionTime = async (req, res, next) => {
    try {
        const {data} = req.body;
        // console.log(data.length);
        for (let i = 0; i < data.length; i++) {
            const functStat = await firestore.collection('Application').doc('appId').collection('Function').doc(data[i]["functionName"]).get();
            if (functStat.exists) {

                let count = functStat.data()["executionCount"];
                let avg = functStat.data()["timeExecuted"];
                count += data[i]["executionCount"];
                avg += data[i]["timeExecuted"];
                await firestore.collection('Application').doc('appId').collection('Function').doc(data[i]["functionName"]).set({
                    "executionCount": count,
                    "timeExecuted": avg
                });
            }
            else {
                console.log(data[i]);
                await firestore.collection('Application').doc('appId').collection('Function').doc(data[i]["functionName"]).set({
                    "executionCount": data[i]["executionCount"],
                    "timeExecuted": data[i]["timeExecuted"]
                });
            }
        }

        res.status(200).send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllFunctionExecutionTimes = async (req, res, next) => {
    try {

        const data = await firestore.collection('Application').doc('appId').collection('Function').get();
        const functionArray = [];
        if(data.empty) {
            res.status(404).send('No record found');
        } else {
            data.forEach(doc => {
                const func = new Function(
                    doc.id, // function name
                    doc.data()["executionCount"],
                    doc.data()["timeExecuted"]
                );
                functionArray.push(func);
            });
            res.send(functionArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getFunctionExecutionTime = async (req, res, next) => {
    try {
        const id = req.params.id;
        const func = await firestore.collection('Application').doc('appId').collection('Function').doc(id);
        const data = await func.get();
        if(!data.exists) {
            res.status(404).send('Function with the given ID not found');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateFunctionExecutionTime = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const func =  await firestore.collection('functions').doc(id);
        await func.update(data);
        res.send('Record updated successfuly');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteFunctionExecutionTime = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('functions').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addFunctionExecutionTime,
    getAllFunctionExecutionTimes,
    getFunctionExecutionTime,
    updateFunctionExecutionTime,
    deleteFunctionExecutionTime
}