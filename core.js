// importing dataschema
const User = require('./model');
const axios=require('axios');
const dotenv=require('dotenv').config()



// core bussiness logic 


// Create A contact
const CreateAccount=async (req,res)=>{
  const { username, currency, amount } = req.body;
  console.log(username, currency, amount)
  if (username && currency && amount) {
    try {
      // Find the user by username
      let user = await User.findOne({ username });

      // If the user doesn't exist, create a new user
      if (!user) {
        user = new User({ username, balances: {} });
      }

      // Update or set the balance for the specified currency
      user.balances.set(currency, (user.balances.get(currency) || 0) + amount);

      // Save the user to the database
      await user.save();

      res.json({ message: `Account topped up with ${amount} ${currency}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  else {
    res.status(400).json({ error: 'Invalid request body' });
  }
  
}

// getting all the
const GETAccount=async (req,res)=>{
  const { username } = req.params
  console.log(username)
  if (username) {
    try {
      // Find the user by username
      const user = await User.findOne({ username });

      if (user) {
        res.json({ username: user.username, balances: user.balances });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  else {
    res.status(400).json({ error: 'Invalid request parameters' });
  }
}
// converting
async function fetchFxRate(fromCurrency, toCurrency) {
  const apiUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${process.env.API}`;
  const response = await axios.get(apiUrl);

  if (response.data['Realtime Currency Exchange Rate']) {
    const exchangeRate = parseFloat(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
    return { exchangeRate };
  } else {
    throw new Error('Exchange rate not found');
  }
}

const Generateqid= async(req,res)=>{
  console.log("calling")
  try {
    const { fromCurrency, toCurrency } = req.body;

    if (!fromCurrency || !toCurrency) {
      return res.status(400).json({ error: 'Both fromCurrency and toCurrency are required.' });
    }

    const quoteId = Math.floor(Math.random() * 100000).toString();
    const expiry_at = new Date(Date.now() + 20000);

    const exchangeRate = await fetchFxRate(fromCurrency, toCurrency);

    res.json({ quoteId, expiry_at, exchangeRate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
}

const Convert=async(req,res)=>{
  try {
    const { quoteId, fromCurrency, toCurrency, amount } = req.body;

    if (!quoteId || !fromCurrency || !toCurrency || isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid request body.' });
    }

    const { exchangeRate } = await fetchFxRate(fromCurrency, toCurrency);

    const convertedAmount = amount * exchangeRate;

    res.json({ convertedAmount, currency: toCurrency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }

}



module.exports={CreateAccount,GETAccount,Convert,Generateqid}



