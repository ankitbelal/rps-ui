import React from 'react';
import { ProgressBar } from 'react-bootstrap';

interface PasswordStrengthMeterProps {
    password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
    const calculateStrength = (pass: string): number => {
        if (!pass) return 0;
        
        let strength = 0;
        
        // Length checks
        if (pass.length >= 8) strength += 20;
        if (pass.length >= 12) strength += 10;
        
        // Character type checks
        if (/[A-Z]/.test(pass)) strength += 20;
        if (/[a-z]/.test(pass)) strength += 20;
        if (/[0-9]/.test(pass)) strength += 15;
        if (/[@$!%*?&#]/.test(pass)) strength += 15;
        
        return Math.min(100, strength);
    };

    const getStrengthLabel = (score: number): string => {
        if (score === 0) return 'No password';
        if (score < 30) return 'Weak';
        if (score < 50) return 'Fair';
        if (score < 70) return 'Good';
        if (score < 90) return 'Strong';
        return 'Very Strong';
    };

    const getVariant = (score: number): string => {
        if (score === 0) return 'danger';
        if (score < 30) return 'danger';
        if (score < 50) return 'warning';
        if (score < 70) return 'info';
        if (score < 90) return 'primary';
        return 'success';
    };

    const getColor = (score: number): string => {
        if (score === 0) return '#dc3545'; // danger
        if (score < 30) return '#dc3545'; // danger
        if (score < 50) return '#ffc107'; // warning
        if (score < 70) return '#0dcaf0'; // info
        if (score < 90) return '#0d6efd'; // primary
        return '#198754'; // success
    };

    const strength = calculateStrength(password);
    const label = getStrengthLabel(strength);
    const variant = getVariant(strength);
    const color = getColor(strength);

    if (!password) {
        return (
            <div className="mt-2">
                <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted">Password Strength:</small>
                    <small className="text-muted">Not entered</small>
                </div>
                <ProgressBar 
                    now={0} 
                    variant="secondary"
                    style={{ height: '6px', backgroundColor: '#e9ecef' }}
                />
            </div>
        );
    }

    return (
        <div className="mt-2">
            <div className="d-flex justify-content-between mb-1">
                <small className="text-muted">Password Strength:</small>
                <small className={`text-${variant} fw-semibold`}>{label}</small>
            </div>
            <ProgressBar 
                now={strength} 
                variant={variant}
                style={{ height: '6px' }}
                aria-label={`Password strength: ${label}`}
            />
            
            {/* Optional: Show detailed requirements with visual indicators */}
            {password && (
                <div className="mt-2 small">
                    <div className="d-flex flex-wrap gap-3">
                        <span className={password.length >= 8 ? 'text-success' : 'text-muted'}>
                            <i className={`fas fa-${password.length >= 8 ? 'check-circle' : 'circle'} me-1`}></i>
                            8+ chars
                        </span>
                        <span className={/[A-Z]/.test(password) ? 'text-success' : 'text-muted'}>
                            <i className={`fas fa-${/[A-Z]/.test(password) ? 'check-circle' : 'circle'} me-1`}></i>
                            Uppercase
                        </span>
                        <span className={/[a-z]/.test(password) ? 'text-success' : 'text-muted'}>
                            <i className={`fas fa-${/[a-z]/.test(password) ? 'check-circle' : 'circle'} me-1`}></i>
                            Lowercase
                        </span>
                        <span className={/[0-9]/.test(password) ? 'text-success' : 'text-muted'}>
                            <i className={`fas fa-${/[0-9]/.test(password) ? 'check-circle' : 'circle'} me-1`}></i>
                            Number
                        </span>
                        <span className={/[@$!%*?&#]/.test(password) ? 'text-success' : 'text-muted'}>
                            <i className={`fas fa-${/[@$!%*?&#]/.test(password) ? 'check-circle' : 'circle'} me-1`}></i>
                            Special
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordStrengthMeter;