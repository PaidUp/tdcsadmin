'use strict';

var should = require('should');
var app = require('../../app');
var config = require('../../config/environment');
var request = require('supertest');
var assert = require('chai').assert;
var loanContractService = require('./loan.contract.service');
var logger = require('../../config/logger');

describe('loanContractService', function () {
  this.timeout(30000);

  it('createPdfContract', function (done) {
    var contractDetails = {
      contractData: {
        isEmail: true,
        convenienceSelect: {
          state: 'Texas',
          creditor: 'Convenience Select, LLC',
          address: '2900 North Quinlan Park Rd. Suite 240-320.',
          city: 'Austin',
          zip: '78732',
          phone: '(855) 764-3232',
          lateChargeDays: '10',
          lateChargePercentage: '5%',
          paymentWithin: '10',
          interestRate: '18% per year',
          agreeToAFeedOf: '$30',
          reInitDebitTimes: 'two',
          calendarDaysAferDebit: 'ten',
          CellPhoneNumber: 6466623303,
          unsubscribeEmailTo: 'ourteam@convenienceslect.com',
          customerServiceTelephoneNumber: '(855) 764-3232',
          signedAt: 'Convenience Select, LLC'
        },
        clientData: {
          DisputesTelephoneNumber: '(855) 764-3232',
          canSendMailAt: '2900 North Quinlan Park Rd. Suite 240-320. Autin, TX 78732',
          canCallYouAt: '(855) 764-3232'
        },
        platform: {
          date: '',
          contractNo: '54b137aa539c803b1aa98368',
          dateofNote: '',
          annualPercentageRate: 8.99,
          financeCharge: 43.53,
          amountFinanced: 1650,
          totalOfPayments: 1693.53,
          numberOfPayments: undefined,
          amountOfPayment: 282.26,
          whenPaymentsAreDue: '2015-01-12T00:00:06-05:00',
          installmentAccountHandlingCharge: 43.53,
          effectiveDate: '',
          schedule: [{
            "capital": 269.9,
            "intrest": 12.36,
            "installment": 282.26,
            "remain": 1380.1,
            "interestSum": 12.36,
            "paymentDay": "2015-01-12T00:00:06-05:00"
      }, {
            "capital": 271.92,
            "intrest": 10.34,
            "installment": 282.26,
            "remain": 1108.18,
            "interestSum": 22.7,
            "paymentDay": "2015-01-12T00:00:06-05:00"
      }, {
            "capital": 273.96,
            "intrest": 8.3,
            "installment": 282.26,
            "remain": 834.22,
            "interestSum": 31,
            "paymentDay": "2015-01-12T00:00:06-05:00"
      }, {
            "capital": 276.01,
            "intrest": 6.25,
            "installment": 282.26,
            "remain": 558.21,
            "interestSum": 37.25,
            "paymentDay": "2015-01-12T00:00:06-05:00"
      }, {
            "capital": 278.08,
            "intrest": 4.18,
            "installment": 282.26,
            "remain": 280.13,
            "interestSum": 41.43,
            "paymentDay": "2015-01-12T00:00:06-05:00"
      }, {
            "capital": 280.13000000000005,
            "intrest": 2.1,
            "installment": 282.23,
            "remain": 0,
            "interestSum": 43.53,
            "paymentDay": "2015-01-12T00:00:06-05:00"
      }]
        },
        client: {
          borrower: 'Jose, Duran',
          address: 'Cra 78A #34A-85 apto 502',
          city: 'Medellin',
          state: 'AS',
          zip: '05003',
          phone: '3006004143',
          name: 'Jose',
          lastName: 'Duran',
          last4ssn: '6789'
        }
      }
    };
    loanContractService.createPdfContract(contractDetails, function (err, signal) {
      assert.isNull(err);
      done();
    });

  });
});
