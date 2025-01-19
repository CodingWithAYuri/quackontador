import React, { useState } from "react";

function SignUpForm() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [errors, setErrors] = useState({});

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setShowRepeatPassword(true);
    validatePassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const validateEmail = (email) => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Email address is invalid.' }));
    } else {
      setErrors(prev => ({ ...prev, email: null }));
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters long.' }));
    } else {
      setErrors(prev => ({ ...prev, password: null }));
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
      <div className="card my-3 mt-0">
        <div className="card-body bg-light p-lg-5 p-md-4 p-sm-3 p-2" autoComplete="off">
          <div className="text-center">
            <img
              src="%PUBLIC_URL%/avatar.png"
              className="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
              width="200px"
              alt="profile"
            />
          </div>
          <div className="d-flex justify-content-center mb-3">
            <h5 className="text-center">Create your account</h5>
          </div>
          <form id="signup-form">
            {/* Name input */}
            <div className="form-outline mb-4">
              <label htmlFor="registerName" className="form-label">Name</label>
              <input type="text" id="registerName" className="form-control" />
            </div>
            {/* Email input */}
            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="registerEmail">Email</label>
              <input type="email" id="registerEmail" className="form-control" value={email} onChange={handleEmailChange} />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </div>
            {/* Password input */}
            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="registerPassword">Password</label>
              <input
                type="password"
                id="registerPassword"
                className="form-control"
                value={password}
                onChange={handlePasswordChange}
              />
              {errors.password && <div className="text-danger">{errors.password}</div>}
            </div>
            {/* Repeat Password input */}
            {showRepeatPassword && (
              <div className="form-outline mb-6">
                <label className="form-label" htmlFor="registerRepeatPassword">Repeat password</label>
                <input type="password" id="registerRepeatPassword" className="form-control" />
              </div>
            )}
            {/* Checkbox */}
            <div className="form-check d-flex justify-content-center mt-2">
              <label className="form-check-label form-check-inline" htmlFor="registerCheck">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="registerCheck"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  aria-describedby="registerCheckHelpText"
                />
                I have read and agree to the terms
              </label>
            </div>
            {/* Submit button */}
            <div className="text-center mt-4">
              <button type="button" className="btn btn-outline-primary px-5 mb-md-0 w-100">
                Registered
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
