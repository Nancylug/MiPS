import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "350px" }}>
        {/* Logo de Catering Urtubey */}
        <img 
          src="/assets/logo.png" 
          alt="Catering Urtubey" 
          style={{ width: "150px", display: "block", margin: "0 auto" }} 
        />
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;





