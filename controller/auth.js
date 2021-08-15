import * as authRepository from '../data/auth.js';

export async function login(req, res) {
  const { id, password } = req.body;
  // console.log(id+password)
  const user = await authRepository.findById({id, password});
  console.log(user)

  //로그인 성공
  if(user.length!=0) {
    req.session.loginData = user
    console.log(req.session.loginData)
    res.status(200).json({ user, message: 'Login success' });
  }
  //로그인 실패
  else{
    res.json({ message: 'Invalid user or password' });
  }
}

export async function logout(req, res) {
  console.log(req.session);
  if(req.session){
    console.log("세션 정보가 있습니다")
    req.session.destroy(() => {
      res.status(200).json({ message: true });
    });
  } else{
    console.log("세션 정보가 없습니다.")
  }
  
}