'use strict';

const firestore = require('../db');
const fs = require("fs");
const Application = require('../models/application');
const { FieldValue } = require('firebase-admin/firestore');

const applicationUpload = async (req, res) => {
        try {   
                console.log(req.body)
                const clientId = req.body.clientId;
                const appId = req.appId;
                
                var userName = {clientId : clientId, appId: appId};

                // converting the JSON object to a string
                const data = JSON.stringify(userName);

                // writing the JSON string content to a file
                fs.writeFile("../config_data/data.json", data, (error) => {
                        // throwing the error
                        // in case of a writing problem
                        if (error) {
                        // logging the error
                        console.error(error);

                        throw error;
                        }
                console.log("data.json written correctly")} )

                res.status(200).send(data);
        }
        catch (error) {
                res.status(400).send(error.message);
        }
}

const applicationRegister = async(req,res) => {
        console.log(req.body)
        const clientId = req.body.clientId;
        const appName = req.body.appName;
        const appStatus = req.body.appStatus
        // console.log(clientId, appName, appStatus)
        let appId = "";
        await firestore.collection('Application').add({
                'Name': appName,
                'Status': appStatus
        }).then((docRef) => {
                appId = docRef.id;
        }).catch(
                error => console.error("Error adding document: ", error)
        );

        const clientApp = await firestore.collection('Client').doc(clientId).get();
        if (clientApp.exists) {
                await firestore.collection('Client').doc(clientId).update({
                        'Application': FieldValue.arrayUnion(appId)
                });
                res.status(200).send(appId);
        } else {
                res.status(400).send('Client ID Invalid');
        }  
}

const getClientApplications = async (req, res) => {
        try {
                const clientId = req.body.clientId;
                const data = await firestore.collection("Client").doc(clientId).get();
                const application = await firestore.collection("Application").get()
                
                const applicationMap = {}
                application.forEach((doc)=>{
                        const id = doc.id
                        const docData = doc.data()
                        console.log(id, docData)
                        applicationMap[id] = {"Name":docData.Name, "Status":docData.Status}
                });
                if (data.exists) {
                        const appData = data.data()["Application"];
                        const appFilterData = []
                        appData.forEach((id)=>{
                                const app = new Application(
                                        id,
                                        applicationMap[id]["Name"],
                                        applicationMap[id]["Status"]
                                );
                                appFilterData.push(app)
                        })
                        res.send(appFilterData);
                }
                else {
                        res.status(400).send("Client not found");
                }

        } 
        catch (error) {
                res.status(400).send(error.message);
        }
}

module.exports = {
        applicationUpload,
        applicationRegister,
        getClientApplications
}
