import { tokens }																				from '../constants/tokens'
import 	 jwt 																						from 'jsonwebtoken';
import   pbkdf2                                         from 'crypto-js/pbkdf2';
import   fetch                                          from 'node-fetch'
import { kiln_constants_en }                            from '../constants/kiln_constants'

test('existingUserLoginAndDataRequest', async () => {
  var hashedPassword = pbkdf2(tokens.client_side_user_test_pass, tokens.client_side_salt_hash, { keySize: 512/32, iterations: 1000 }).toString();
  var userDataPairToken = jwt.sign({email: tokens.client_side_user_test_email, hash: hashedPassword}, tokens.client_side_salt);
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({userDataPairToken})
  }

  expect.assertions(4);

  var token = '';

  await fetch(`http://localhost:8060/`, requestOptions)
  .then(
    async response => {
      await response.json()
        .then(
          json => {
            token = json.token;
            expect(json.token).toEqual(jwt.sign(tokens.client_side_value, tokens.client_side_token)); 
            expect(json.NAME).toEqual('Борис'); 
            expect(json.SURNAME).toEqual('Смирнов'); 
          }
      )
    }
  )

  const requestOptionsRequest = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
  }
  
  await fetch('http://localhost:8060/?generaltimeline=' + kiln_constants_en.Раиса, requestOptionsRequest)
  .then(
    async response => {
      await response.json()
        .then(
          json => {
            expect(json[0].affectedRows).toBeGreaterThan(0); 
          }
      )
    }
  )

})