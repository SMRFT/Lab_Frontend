import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { FaPlus, FaTrash, FaEnvelope } from "react-icons/fa";
import styled from "styled-components";

// Styled modal to increase size
const StyledModal = styled(Modal)`
  .modal-dialog {
    max-width: 80%;
    margin: 1.75rem auto;
  }

  .modal-content {
    padding: 1.5rem;
  }
`;

// Toggle switch styles
const ToggleSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 25px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 19px;
    width: 19px;
    left: 4px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #4caf50;
  }

  input:checked + .slider:before {
    transform: translateX(24px);
  }
`;

const TestForm = ({ show, setShow }) => {
  const [formData, setFormData] = useState({
    test_name: "",
    shortcut: "",
    department: "",
    method: "",
    collection_container: "",
    specimen_type: "",
    reference_range: "",
    units: "",
    MRP: "",
    L2L_Rate_Card: "",
    parameters: {},
    status: "Pending"
  });
  const Labbaseurl = process.env.REACT_APP_BACKEND_LAB_BASE_URL;
  const [parameterList, setParameterList] = useState([
    {
      test_name: "",
      department: "",
      method: "",
      unit: "",
      reference_range: "",
    },
  ]);

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [parametersVisible, setParametersVisible] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedTestName, setSubmittedTestName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleParameterChange = (index, e) => {
    const { name, value } = e.target;
    const updatedParameters = [...parameterList];
    updatedParameters[index][name] = value;
    setParameterList(updatedParameters);
  };

  const addParameter = () => {
    setParameterList([
      ...parameterList,
      { test_name: "", department: "", method: "", unit: "", reference_range: "" },
    ]);
  };

  const removeParameter = (index) => {
    const updatedParameters = parameterList.filter((_, i) => i !== index);
    setParameterList(updatedParameters);
  };

// Update the handleSubmit function in TestForm.jsx to ensure the full test details are sent for approval

const handleSubmit = (e) => {
  e.preventDefault();

  const updatedFormData = {
    ...formData,
    parameters: parameterList,
  };
  // console.log("Final Form Data:", updatedFormData);

  axios
    .post(`${Labbaseurl}test_details/`, updatedFormData)
    .then((response) => {
      // console.log("Response:", response.data);
      setMessage("Form submitted successfully! An approval email has been sent.");
      setMessageType("success");
      setFormSubmitted(true);
     
      // Store the test name for approval
      setSubmittedTestName(formData.test_name);
     
      // Send approval email with test name
      // console.log("Sending approval email for:", formData.test_name);
      sendApprovalEmail(formData.test_name);
     
      // Reset form
      setFormData({
        test_name: "",
        shortcut:"",
        department: "",
        method: "",
        collection_container: "",
        specimen_type: "",
        reference_range: "",
        units: "",
        MRP: "",
        L2L_Rate_Card: "",
        parameters: {},
        status: "Pending"
      });
      setParameterList([
        {
          test_name: "",
          department: "",
          method: "",
          unit: "",
          reference_range: "",
        },
      ]);

      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
    })
    .catch((error) => {
      console.error("Error posting data:", error);
      setMessage("Failed to submit the form. Please try again.");
      setMessageType("danger");

      setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);
    });
};

const sendApprovalEmail = (testName) => {
  // Send approval email request to backend with improved error handling
  // console.log("sendApprovalEmail function called with:", testName);
 
  axios
    .post(`${Labbaseurl}send_approval_email/`, {
      test_name: testName,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      console.log("Approval email sent successfully:", response.data);
    })
    .catch(error => {
      console.error("Error sending approval email:", error.response ? error.response.data : error.message);
    });
};

  const handleClose = () => {
    setShow(false);
    setMessage(null);
    setMessageType(null);
    setFormSubmitted(false);
  };

  return (
    <StyledModal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Test Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )}

        {formSubmitted ? (
          <div className="text-center p-4">
            <h4>Test has been submitted successfully!</h4>
            <p>An approval email has been sent.</p>
          </div>
        ) : (
          <form>
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="test_name" className="form-label">Test Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="test_name"
                  name="test_name"
                  value={formData.test_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-1">
                <label htmlFor="shortcut" className="form-label">Shortcut</label>
                <input
                  type="text"
                  className="form-control"
                  id="shortcut"
                  name="shortcut"
                  value={formData.shortcut}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="department" className="form-label">Department</label>
                <input
                  type="text"
                  className="form-control"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="method" className="form-label">Method</label>
                <input
                  type="text"
                  className="form-control"
                  id="method"
                  name="method"
                  value={formData.method}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="collection_container" className="form-label">Collection Container</label>
                <input
                  type="text"
                  className="form-control"
                  id="collection_container"
                  name="collection_container"
                  value={formData.collection_container}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="specimen_type" className="form-label">Specimen Type</label>
                <input
                  type="text"
                  className="form-control"
                  id="specimen_type"
                  name="specimen_type"
                  value={formData.specimen_type}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="reference_range" className="form-label">Reference Range</label>
                <input
                  type="text"
                  className="form-control"
                  id="reference_range"
                  name="reference_range"
                  value={formData.reference_range}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="units" className="form-label">Units</label>
                <input
                  type="text"
                  className="form-control"
                  id="units"
                  name="units"
                  value={formData.units}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="MRP" className="form-label">MRP</label>
                <input
                  type="number"
                  className="form-control"
                  id="MRP"
                  name="MRP"
                  value={formData.MRP}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="L2L_Rate_Card" className="form-label">L2L Rate Card</label>
                <input
                  type="number"
                  className="form-control"
                  id="L2L_Rate_Card"
                  name="L2L_Rate_Card"
                  value={formData.L2L_Rate_Card}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <ToggleSwitch>
                <span>Show Parameters</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={parametersVisible}
                    onChange={(e) => setParametersVisible(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </ToggleSwitch>
            </div>

            {parametersVisible && (
              <>
                {parameterList.map((parameter, index) => (
                  <div className="row mb-3" key={index}>
                    <div className="col-md-2">
                      <label htmlFor={`test_name_${index}`} className="form-label">
                        Test Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`test_name_${index}`}
                        name="test_name"
                        value={parameter.test_name}
                        onChange={(e) => handleParameterChange(index, e)}
                      />
                    </div>                
                    <div className="col-md-2">
                      <label htmlFor={`department_${index}`} className="form-label">
                        Department
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`department_${index}`}
                        name="department"
                        value={parameter.department}
                        onChange={(e) => handleParameterChange(index, e)}
                      />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor={`method_${index}`} className="form-label">
                        Method
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`method_${index}`}
                        name="method"
                        value={parameter.method}
                        onChange={(e) => handleParameterChange(index, e)}
                      />
                    </div>
                    <div className="col-md-2">
                      <label htmlFor={`unit_${index}`} className="form-label">
                        Unit
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`unit_${index}`}
                        name="unit"
                        value={parameter.unit}
                        onChange={(e) => handleParameterChange(index, e)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor={`reference_range_${index}`} className="form-label">
                        Reference Range
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`reference_range_${index}`}
                        name="reference_range"
                        value={parameter.reference_range}
                        onChange={(e) => handleParameterChange(index, e)}
                      />
                    </div>
                    <div className="col-md-1 d-flex justify-content-center align-items-center">
                      <button
                        type="button"
                        className="btn btn-danger mt-4"
                        onClick={() => removeParameter(index)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addParameter}
                  style={{float:"right"}}
                >
                  <FaPlus /> Add Parameter
                </button>
              </>
            )}

            <button type="submit" className="btn btn-success" onClick={handleSubmit}>
              Submit
            </button>
          </form>
        )}
      </Modal.Body>
    </StyledModal>
  );
};

export default TestForm;