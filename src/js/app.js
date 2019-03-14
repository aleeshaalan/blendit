App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load lands.
    $.getJSON('../lands.json', function(data) {
      var landsRow = $('#landsRow');
      var landTemplate = $('#landTemplate');

      for (i = 0; i < data.length; i ++) {
        landTemplate.find('.panel-title').text(data[i].name);
        landTemplate.find('img').attr('src', data[i].picture);
        landTemplate.find('.land-breed').text(data[i].breed);
        landTemplate.find('.land-age').text(data[i].age);
        landTemplate.find('.land-location').text(data[i].location);
        landTemplate.find('.btn-lend').attr('data-id', data[i].id);

        landsRow.append(landTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
                // Modern dapp browsers...
        if (window.ethereum) {
          App.web3Provider = window.ethereum;
          try {
            // Request account access
            await window.ethereum.enable();
          } catch (error) {
            // User denied account access...
            console.error("User denied account access")
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Lending.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var LendingArtifact = data;
      App.contracts.Lending = TruffleContract(LendingArtifact);
    
      // Set the provider for our contract
      App.contracts.Lending.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the lended lands
      return App.markLended();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-lend', App.handleLend);
  },

  markLended: function(lenders, account) {
    var lendionInstance;

App.contracts.Lending.deployed().then(function(instance) {
  lendionInstance = instance;

  return lendionInstance.getLenders.call();
}).then(function(lenders) {
  for (i = 0; i < lenders.length; i++) {
    if (lenders[i] !== '0x0000000000000000000000000000000000000000') {
      $('.panel-land').eq(i).find('button').text('Success').attr('disabled', true);
    }
  }
}).catch(function(err) {
  console.log(err.message);
});
  },

  handleLend: function(event) {
    event.preventDefault();

    var lendId = parseInt($(event.target).data('id'));

    var lendionInstance;

web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }

  var account = accounts[0];

  App.contracts.Lending.deployed().then(function(instance) {
    lendionInstance = instance;

    // Execute lend as a transaction by sending account
    return lendionInstance.lend(lendId, {from: account});
  }).then(function(result) {
    return App.markLended();
  }).catch(function(err) {
    console.log(err.message);
  });
});
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
