import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";

import { useAuth } from "../contexts/AuthContext";
import { cn } from "../utils/cn";

import logo from "../assets/logo.png";
import Box from "../components/generic/Box";
import InputInfo from "../components/login/InputInfo";

const ERROR_FORM = {
  NONE: 0,
  INVALID_NUM: 1,
  INVALID_SPACE: 2,
  INVALID: 3,
  REQUIRED: 4,
  VALID: 5,
  TOO_MANY_LOGIN_ATTEMPTS: 6,
  TOO_MANY_REGISTERS: 7,
  NOTHING: 8,
};

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [nameFormError, setNameFormError] = useState(ERROR_FORM.NONE);
  const [emailFormError, setEmailFormError] = useState(ERROR_FORM.NONE);
  const [passwordFormError, setPasswordFormError] = useState(ERROR_FORM.NONE);
  const { login, register, updateBalance } = useAuth();
  const navigate = useNavigate();

  const emailFormErrorMessages = {
    [ERROR_FORM.INVALID_NUM]: "Email inválido.",
    [ERROR_FORM.INVALID]: "Uma conta já existe com este email.",
    [ERROR_FORM.REQUIRED]: "Campo obrigatório.",
    [ERROR_FORM.NOTHING]: "",
  };

  const nameFormErrorMessages = {
    [ERROR_FORM.INVALID_NUM]:
      "Nome de usuário precisa ter entre 5 e 16 caracteres.",
    [ERROR_FORM.INVALID_SPACE]:
      "Nome de usuário não pode ter espaços ou caracteres especiais.",
    [ERROR_FORM.INVALID]: "Nome de usuário já existe.",
    [ERROR_FORM.REQUIRED]: "Campo obrigatório.",
    [ERROR_FORM.NOTHING]: "",
  };

  const passwordFormErrorMessages = {
    [ERROR_FORM.INVALID_NUM]: "Senha precisa ter entre 8 e 32 caracteres.",
    [ERROR_FORM.INVALID_SPACE]: "Senha não pode ter espaços.",
    [ERROR_FORM.REQUIRED]: "Campo obrigatório.",
    [ERROR_FORM.INVALID]: "Nome/senha errado(s).",
    [ERROR_FORM.TOO_MANY_LOGIN_ATTEMPTS]:
      "Muitas tentativas de login, tente novamente mais tarde.",
    [ERROR_FORM.TOO_MANY_REGISTERS]:
      "Muitas contas registradas, tente novamente mais tarde",
  };

  const handleShow = () => {
    setShow((prev) => !prev);
  };

  function validateRequiredFields(isRegister: boolean) {
    let valid = true;

    if (name.length === 0) {
      setNameFormError(ERROR_FORM.REQUIRED);
      valid = false;
    }

    if (password.length === 0) {
      setPasswordFormError(ERROR_FORM.REQUIRED);
      valid = false;
    }

    if (isRegister && email.length === 0) {
      setEmailFormError(ERROR_FORM.REQUIRED);
      valid = false;
    }

    return valid;
  }

  function isFormValid(isRegister: boolean) {
    return (
      nameFormError === ERROR_FORM.VALID &&
      passwordFormError === ERROR_FORM.VALID &&
      (!isRegister || emailFormError === ERROR_FORM.VALID)
    );
  }

  const handleRegister = async () => {
    if (!isFormValid(false)) {
      validateRequiredFields(false);
      return;
    }

    const result = await register(name, email, password);

    if (result === "USERNAME_TAKEN") {
      setNameFormError(ERROR_FORM.INVALID);
    } else if (result === "EMAIL_TAKEN") {
      setEmailFormError(ERROR_FORM.INVALID);
    } else if (result === "TOO_MANY_REGISTER_ATTEMPTS") {
      setEmailFormError(ERROR_FORM.NOTHING);
      setNameFormError(ERROR_FORM.NOTHING);
      setPasswordFormError(ERROR_FORM.TOO_MANY_REGISTERS);
    } else if (result === "SUCCESS") {
      navigate("/home");
    }
  };

  const handleLogin = async () => {
    if (!isFormValid(false)) {
      validateRequiredFields(false);
      return;
    }

    const result = await login(name, password);

    if (result === "SUCCESS") {
      await updateBalance();
      console.log("test");
      navigate("/home");
    } else if (result === "TOO_MANY_LOGIN_ATTEMPTS") {
      setNameFormError(ERROR_FORM.NOTHING);
      setPasswordFormError(ERROR_FORM.TOO_MANY_LOGIN_ATTEMPTS);
    } else {
      setNameFormError(ERROR_FORM.NOTHING);
      setPasswordFormError(ERROR_FORM.INVALID);
    }
  };

  function validateName(value: string) {
    if (value.length === 0) {
      return ERROR_FORM.NONE;
    }

    if (value.length < 5 || value.length > 16) {
      return ERROR_FORM.INVALID_NUM;
    }

    if (/[^a-zA-Z0-9]/.test(value)) {
      return ERROR_FORM.INVALID_SPACE;
    }

    return ERROR_FORM.VALID;
  }

  function validatePassword(value: string) {
    if (value.length === 0) {
      return ERROR_FORM.NONE;
    }

    if (value.length < 8 || value.length > 32) {
      return ERROR_FORM.INVALID_NUM;
    }

    if (value.includes(" ")) {
      return ERROR_FORM.INVALID_SPACE;
    }

    return ERROR_FORM.VALID;
  }

  function validateEmail(value: string) {
    if (value.length === 0) {
      return ERROR_FORM.NONE;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(value) ? ERROR_FORM.VALID : ERROR_FORM.INVALID_NUM;
  }

  const handleNameFormError = () => {
    setNameFormError(validateName(name));
  };

  const handleEmailFormError = () => {
    setEmailFormError(validateEmail(email));
  };

  const handlePasswordFormError = () => {
    setPasswordFormError(validatePassword(password));
  };

  const handleChangeMode = () => {
    setRegistering((prev) => !prev);

    setEmail("");
    setName("");
    setPassword("");

    setEmailFormError(ERROR_FORM.NONE);
    setNameFormError(ERROR_FORM.NONE);
    setPasswordFormError(ERROR_FORM.NONE);
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (registering) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  function FormErrorMessage({ message }: { message?: string }) {
    if (!message) return null;

    return (
      <div className="mt-3 text-center font-semibold text-red-500">
        {message}
      </div>
    );
  }

  function hasError(error: number) {
    return error !== ERROR_FORM.NONE && error !== ERROR_FORM.VALID;
  }

  return (
    <div className="z-1 flex flex-col items-center">
      <img src={logo} alt="Logo" className="pointer-events-none select-none" />
      <Box className="mt-8 h-auto w-170 flex-col items-center gap-y-6 py-12">
        {/* Titulo */}
        <div className="pb-2 text-center font-sans text-[36px] font-bold">
          {registering ? "Registrar" : "Login"}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-y-6"
        >
          {/* Input Email */}
          {registering && (
            <div>
              <InputInfo
                value={email}
                onChange={setEmail}
                onErrorReset={handleEmailFormError}
                placeholder="Email"
                className="w-125"
                type="text"
                error={
                  emailFormError !== ERROR_FORM.VALID &&
                  emailFormError !== ERROR_FORM.NONE
                }
              />

              {hasError(emailFormError) && (
                <FormErrorMessage
                  message={emailFormErrorMessages[emailFormError]}
                />
              )}
            </div>
          )}

          {/* Input Nome */}
          <div>
            <InputInfo
              value={name}
              onChange={setName}
              onErrorReset={handleNameFormError}
              placeholder="Nome"
              className="w-125"
              type="text"
              error={
                nameFormError !== ERROR_FORM.VALID &&
                nameFormError !== ERROR_FORM.NONE
              }
            />

            {hasError(nameFormError) && (
              <FormErrorMessage
                message={nameFormErrorMessages[nameFormError]}
              />
            )}
          </div>

          {/* Input Senha */}
          <div className="relative">
            <InputInfo
              value={password}
              onChange={setPassword}
              onErrorReset={handlePasswordFormError}
              placeholder="Senha"
              className="w-125"
              type={show ? "text" : "password"}
              error={
                passwordFormError !== ERROR_FORM.VALID &&
                passwordFormError !== ERROR_FORM.NONE
              }
            />

            {hasError(passwordFormError) && (
              <FormErrorMessage
                message={passwordFormErrorMessages[passwordFormError]}
              />
            )}

            <button
              type="button"
              onClick={handleShow}
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              className="absolute top-2.75 right-3.5 cursor-pointer"
            >
              {show ? (
                <IoEye color="#5F5F5F" size="30px" />
              ) : (
                <IoEyeOff color="#5F5F5F" size="30px" />
              )}
            </button>
          </div>

          {/* Botão */}
          <button
            type="submit"
            className={cn(
              "mt-5 mb-9 cursor-pointer rounded-xl",
              "p-2 px-10",
              "text-[24px] font-bold",
              "bg-green-500",
              "transition duration-200 ease-in-out",
              "enabled:hover:shadow-[0_0_20px_rgba(0,201,80,0.4)]",
            )}
          >
            {registering ? "Criar conta" : "Entrar"}
          </button>
        </form>

        {/* Trocar página */}
        <div className="absolute bottom-7 flex gap-1.5 text-[18px]">
          <div>{registering ? "Já" : "Não"} possui uma conta?</div>
          <button
            type="button"
            className="cursor-pointer text-green-500 underline hover:text-green-300"
            onClick={handleChangeMode}
          >
            clique aqui
          </button>
          <div>para {registering ? "fazer login" : "se registrar"}.</div>
        </div>
      </Box>
    </div>
  );
}
