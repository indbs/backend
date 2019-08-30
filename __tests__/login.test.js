import { tokens }																				from '../constants/tokens'
import 	 jwt 																						from 'jsonwebtoken';

describe('loginTest', () => {
  it('userLogin', test_login('b.smirnov@rusgates.ru', 'password'))
})

function test_login(password){
  var hashedPassword = pbkdf2(password, tokens.client_side_salt_hash, { keySize: 512/32, iterations: 1000 }).toString();
  var userDataPairToken = jwt.sign({email: email, hash: hashedPassword}, tokens.client_side_salt);
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({userDataPairToken})
  }
  expects(
    fetch(`http://172.16.20.75:8060/`, requestOptions)
      .then((response)=>{
        response.text()
          .then(text => {
            const data = text && JSON.parse(text);
            return data;
          })
      })
  ).toEqual({user: 'test'})
}