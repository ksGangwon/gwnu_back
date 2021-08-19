import * as authRepository from "../data/auth.js";
import bcrypt from "bcrypt";

export async function login(req, res) {
  const { id, password } = req.body;
  const user = await authRepository.findById({ id });
  bcrypt.compare(password, user[0].password, (err, same) => {
    if (same) {
      req.session.loginData = user;
      req.session.is_logined = true;
      console.log(req.session);
      req.session.save(() => {
        res.status(200).json({ user, message: "Login success" });
      });
    } else {
      res.json({ message: "아이디 또는 패스워드가 틀렸습니다." });
    }
  });
}

export async function logout(req, res) {
  if (req.session) {
    console.log("세션 정보가 있습니다");
    req.session.destroy(() => {
      res.status(200).json({ message: true });
    });
  } else {
    console.log("세션 정보가 없습니다.");
  }
}
