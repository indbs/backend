import { tokens }																				from '../constants/tokens'
import 	 jwt 																						from 'jsonwebtoken';
import   pbkdf2                                         from 'crypto-js/pbkdf2';
import   fetch                                          from 'node-fetch'

test('existingUserLoginTest', async () => {
  var hashedPassword = pbkdf2('1234', tokens.client_side_salt_hash, { keySize: 512/32, iterations: 1000 }).toString();
  var userDataPairToken = jwt.sign({email: 'b.smirnov@rusgates.ru', hash: hashedPassword}, tokens.client_side_salt);
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({userDataPairToken})
  }

  expect.assertions(2);

  return await fetch(`http://localhost:8060/`, requestOptions)
  .then(
    async response => {
      return await response.json()
        .then(
          json => {
            console.log('json: ', json);
            expect(json.NAME).toEqual('Борис'); 
            expect(json.SURNAME).toEqual('Смирнов'); 
            return json;
          }
      )
    },
    error => expect(error).toEqual({user: 'test'})
  )

})