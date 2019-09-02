import { tokens }																				from '../constants/tokens'
import 	 jwt 																						from 'jsonwebtoken';
import   pbkdf2                                         from 'crypto-js/pbkdf2';
import { createMySQLConnection,
         makeMySQLConnection } 													from '../connection';
import { handlePOST_LoginRequest }											from '../RequestMethodHandlers/postHandler'

test('existingUserLoginTest', async () => {
  var hashedPassword = pbkdf2(tokens.client_side_user_test_pass, tokens.client_side_salt_hash, { keySize: 512/32, iterations: 1000 }).toString();
  var userDataPairToken = jwt.sign({email: tokens.client_side_user_test_email, hash: hashedPassword}, tokens.client_side_salt);
  const requestOptions = {
    body: JSON.stringify({userDataPairToken})
  }

  expect.assertions(1);
  var connection = createMySQLConnection();
  return await makeMySQLConnection(connection).then(
    await handlePOST_LoginRequest(requestOptions.body, connection).then(
      result  => {expect(result).toEqual({
        "responseCode": 200,
        "responseResult": "{\"ID\":11,\"EMAIL\":\"b.smirnov@rusgates.ru\",\"NAME\":\"Борис\",\"SURNAME\":\"Смирнов\",\"token\":\"eyJhbGciOiJIUzI1NiJ9.bXVzdF9iZV9hX3Rva2Vu.taeWjGObAd8HqlROkYVhcp_MMGMgOfxiKZSD3U8PYq4\"}",
        "responseType": "application/json",
      })},
      error   => {expect(error).toEqual({user: 'test'})},
      )
    )
})

test('notExistingUserLoginTest', async () => {
  var hashedPassword = pbkdf2('incorrect_password', tokens.client_side_salt_hash, { keySize: 512/32, iterations: 1000 }).toString();
  var userDataPairToken = jwt.sign({email: tokens.client_side_user_test_email, hash: hashedPassword}, tokens.client_side_salt);
  const requestOptions = {
    body: JSON.stringify({userDataPairToken})
  }

  expect.assertions(1);
  var connection = createMySQLConnection();
  return await makeMySQLConnection(connection).then(
    await handlePOST_LoginRequest(requestOptions.body, connection).then(
      result  => {expect(result).toEqual({user: 'test'})},
      error   => {expect(error).toEqual({
        "responseCode": 400,
        "responseResult": "{\"message\":\"Неправильное имя пользователя или пароль!\"}",
        "responseType": "application/json",
      })},
      )
    )
})