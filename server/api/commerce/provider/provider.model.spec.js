'use strict';
var faker = require('faker');

var data = {
    provider:{
        //Team info
        teamName: faker.company.companyName(),
        teamNumber: faker.random.number(),
        teamAverageSize: faker.random.number()+1,
        teamSport:'Baseball',
        //End team info
        
        //Owner info
        ownerId: 'xxx',
        ownerFirstName: faker.name.firstName(),
        ownerLastName: faker.name.lastName(),
        ownerDOB: faker.date.past(),
        ownerSSN: 'uVCqIzCZ+zGw',
        ownerEmail: faker.internet.email(),
        ownerPhone: faker.phone.phoneNumber(),
        //End owner info
        
        //Billing info
        country: 'US',
        state: 'TX',
        city: faker.address.city(),
        zipCode: '12312',
        averagePayment: '500',
        EIN: '00-0000000',
        Address: faker.address.streetAddress(),
        website: faker.internet.domainName(),
        businessName: faker.company.companyName(),
        phoneNumber: faker.phone.phoneNumber(),
        businessType:'Corporation',
        //End billing info
        
        //Billing info
        aba: '110000000',// 'uVOpJzWf/Dm5',//'110000000',
        dda: '000123456789',// 'uFKpJjec+Dy/Foz/',//'000123456789'
        referralCode: faker.lorem.words()
    }
        //encryptKey : 'PZ3oXv2v6Pq5HAPFI9NFbQ==',
        //encryptValue : ''
}

module.exports = data;
