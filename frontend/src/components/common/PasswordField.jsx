function PasswordField({
    label,
    name,
    value,
    onChange,
    show,
    onToggle,
    error,
    placeholder,
    helpText,
    required = true,
    className = "form-control form-control-lg",
    autoComplete = "current-password"
}) {
    return (
        <div className="mb-3">
            {label ? (
                <label className="form-label fw-semibold">
                    {label} {required ? <span className="text-danger">*</span> : null}
                </label>
            ) : null}
            <div className="input-group">
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    className={`${className}${error ? " is-invalid" : ""}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    autoComplete={autoComplete}
                />
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onToggle}
                    aria-label={show ? "Hide password" : "Show password"}
                    title={show ? "Hide password" : "Show password"}
                >
                    <span aria-hidden="true">{show ? "🙈" : "👁"}</span>
                </button>
            </div>
            {error ? <div className="invalid-feedback d-block">{error}</div> : null}
            {helpText ? <small className="text-muted d-block mt-2">{helpText}</small> : null}
        </div>
    );
}

export default PasswordField;