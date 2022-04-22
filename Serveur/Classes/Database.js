class Database {
    constructor() {
        const { MongoClient } = require('mongodb');
        this.url = "mongodb://localhost:27017/";
        this.client = new MongoClient(this.url);
    }

    async creer(nomTable, donnees) {
        await this.client.connect();
    
        var database = this.client.db('battleship');
        var table = database.collection(nomTable);
    
        var resultat = await table.insertOne(donnees);
    
        await this.client.close();
    }

    async lire(nomTable) {
        await this.client.connect();
    
        var database = this.client.db('battleship');
        var table = database.collection(nomTable);
    
        var resultat = await table.find().toArray();
    
        await this.client.close();
    
        return resultat;
    }

    async modifier(nomTable, filter, donnees) {
        await this.client.connect();
    
        var database = this.client.db('battleship');
        var table = database.collection(nomTable);
    
        var resultat = await table.updateOne(filter, donnees);
    
        await this.client.close();
    }

    async supprimer(nomTable, query) {
        await this.client.connect();
    
        var database = this.client.db('battleship');
        var table = database.collection(nomTable);
    
        var resultat = await table.deleteOne(query);
    
        await this.client.close();
    }
}

module.exports = Database;