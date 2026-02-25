import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Form, Alert, Container, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { profileSchema, passwordSchema } from '../../helper/schema';
import PasswordStrengthMeter from './PasswordStrengthMeter';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setPageTitle } from '../../features/ui/uiSlice';
import { 
    useGetAdminProfileDataQuery,
    useUpdateAdminProfileMutation,
    useGetTeacherProfileDataQuery,
    useUpdateTeacherProfileMutation,
    useUpdatePasswordMutation
} from '../../features/profile/profileApi';
import { RootState } from '../../app/store';
import { getRoleByType } from '../../helper';
import toast from 'react-hot-toast';
import { ProfileData } from '../../features/profile/utils';

interface ProfileFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    DOB: string;
    address1: string;
    address2: string | null;
}

interface PasswordFormData {
    currentPassword: string;
    password: string;
    confirmPassword: string;
}

const ProfilePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
    const [role,setRole]=useState<string>("");
    const [profileData,setProfileData] = useState<ProfileData>();
    const {user} = useAppSelector((state:RootState)=>state.auth);

    const {data:adminProfileData,isLoading:isGetingProfileData}=useGetAdminProfileDataQuery(undefined,{skip:role !== "admin" && role !== "superadmin",refetchOnMountOrArgChange:true});
    const {data:teacherProfileData, isLoading:isProfileDataLoading}=useGetTeacherProfileDataQuery(undefined,{skip:role!=="teacher",refetchOnMountOrArgChange:true});
    const [updateAdminProfile,{isLoading:isUpdatingAdmin}]=useUpdateAdminProfileMutation();
    const [updateTeacherProfile,{isLoading:isUpdatingTeacher}]=useUpdateTeacherProfileMutation();
    const [updatePassword,{isLoading:isUpdatingPassword}]=useUpdatePasswordMutation();



    useEffect(() => {
      dispatch(
        setPageTitle({
          title: "Profile Management",
          subtitle: "Manage your profile information and password",
        }),
      );
    }, [dispatch]);

    useEffect(()=>{
        if(user){
            setRole(getRoleByType(user?.UserType));
        }
    },[user])

    const {
        register: registerProfile,
        handleSubmit: handleProfileSubmit,
        reset: resetProfile,
        formState: { errors: profileErrors, isDirty },
    } = useForm<ProfileFormData>({
        resolver: yupResolver(profileSchema as any),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            gender: '',
            DOB: '',
            address1: '',
            address2: '',
        }
    });

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        reset: resetPassword,
        watch: watchPassword,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormData>({
        resolver: yupResolver(passwordSchema as any),
        defaultValues: {
            currentPassword: '',
            password: '',
            confirmPassword: '',
        }
    });

    const newPassword = watchPassword('password', '');

    useEffect(() => {
        if(adminProfileData?.data){
            resetProfile({
                firstName: adminProfileData.data[0].firstName,
                lastName: adminProfileData.data[0].lastName,
                email: adminProfileData.data[0].email,
                phone: adminProfileData.data[0].phone,
                gender: adminProfileData.data[0].gender,
                DOB: adminProfileData.data[0].DOB,
                address1: adminProfileData.data[0].address1,
                address2: adminProfileData.data[0].address2 || '',
            });
            setProfileData(adminProfileData.data[0])
        }if(teacherProfileData?.data){
            resetProfile({
                firstName: teacherProfileData.data[0].firstName,
                lastName: teacherProfileData.data[0].lastName,
                email: teacherProfileData.data[0].email,
                phone: teacherProfileData.data[0].phone,
                gender: teacherProfileData.data[0].gender,
                DOB: teacherProfileData.data[0].DOB,
                address1: teacherProfileData.data[0].address1,
                address2: teacherProfileData.data[0].address2 || '',
            });setProfileData(teacherProfileData.data[0])
        }
    }, [resetProfile,adminProfileData,teacherProfileData]);

    const handleProfileFormSubmit = async (data: ProfileFormData) => {
        let response;
        try {

            if(role === "admin" || role === "superadmin"){
                response = await toast.promise(updateAdminProfile(data).unwrap(),{
                    loading:"Updatin Profile.."
                });
            }else if(role === "teacher"){
                response = await toast.promise(updateTeacherProfile(data).unwrap(),{
                    loading:"Updatin Profile.."
                });
            }
            if(response.success){
                setIsEditing(false);
                toast.success(response.message);
            }   
        } catch (error:any) {
            const errorMessage = error?.data?.message || "Failed to update profile";
            toast.error(errorMessage);
        }
    };

    const handlePasswordFormSubmit = async (data: PasswordFormData) => {
        if(!data) return;
        try {
            const payload = {
                ...data,
                email:user?.email
            }
            const response = await toast.promise(updatePassword(payload).unwrap(),{
                loading:"Updating password..."
            })

            if(response.success){
                toast.success(response.message);
                resetPassword({
                    currentPassword: '',
                    password: '',
                    confirmPassword: '',
                });
            }
        } catch (error:any) {
            const errorMessage = error?.data?.message || "Failed to update password";
            toast.error(errorMessage);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleTabChange = (tab: 'profile' | 'password') => {
        setActiveTab(tab);
        if (tab === 'password') {
            resetPassword({
                currentPassword: '',
                password: '',
                confirmPassword: '',
            });
        }
    };

    // Format gender for display
    const formatGender = (gender: string) => {
        switch(gender) {
            case 'M': return 'Male';
            case 'F': return 'Female';
            case 'O': return 'Other';
            default: return gender;
        }
    };

    if (isGetingProfileData || isProfileDataLoading) {
        return (
            <Container className="py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading profile data...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            {/* Page Header */}
            <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-primary rounded-circle p-3 d-flex align-items-center justify-content-center"
                     style={{ width: '60px', height: '60px' }}>
                    <i className="fas fa-user-edit text-white fs-3"></i>
                </div>
                <div>
                    <h4 className="mb-1 fw-bold">My Profile</h4>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-4">
                <div className="d-flex border-bottom">
                    <Button
                        variant="link"
                        className={`text-decoration-none px-4 py-3 position-relative ${activeTab === 'profile' ? 'text-primary fw-bold' : 'text-muted'}`}
                        onClick={() => handleTabChange('profile')}
                        style={{ 
                            borderBottom: activeTab === 'profile' ? '2px solid var(--bs-primary)' : 'none',
                            marginBottom: '-1px'
                        }}
                    >
                        <i className="fas fa-user me-2"></i>
                        Profile Information
                    </Button>
                    <Button
                        variant="link"
                        className={`text-decoration-none px-4 py-3 position-relative ${activeTab === 'password' ? 'text-primary fw-bold' : 'text-muted'}`}
                        onClick={() => handleTabChange('password')}
                        style={{ 
                            borderBottom: activeTab === 'password' ? '2px solid var(--bs-primary)' : 'none',
                            marginBottom: '-1px'
                        }}
                    >
                        <i className="fas fa-lock me-2"></i>
                        Change Password
                    </Button>
                </div>
            </div>

            {/* Content Cards */}
            {activeTab === 'profile' ? (
                // Profile Information Form
                <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                        {/* Header Section - Fixed Layout */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                            <div className="d-flex align-items-center mb-3 mb-md-0">
                                <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center me-3">
                                    <i className="fas fa-info-circle text-primary"></i>
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-1">Profile Information</h6>
                                    <p className="text-muted small mb-0">
                                        {!isEditing 
                                            ? "Your profile information is currently view-only" 
                                            : "You are editing your profile information"}
                                    </p>
                                </div>
                            </div>
                            
                            {!isEditing ? (
                                <Button 
                                    variant="primary"
                                    onClick={() => setIsEditing(true)}
                                    className="px-4"
                                    disabled={isGetingProfileData || isProfileDataLoading}
                                >
                                    <i className="fas fa-edit me-2"></i>
                                    Edit Profile
                                </Button>
                            ) : (
                                <Alert variant="info" className="d-flex align-items-center mb-0 py-2 px-3">
                                    <i className="fas fa-pencil-alt me-2"></i>
                                    <span>Editing mode</span>
                                </Alert>
                            )}
                        </div>

                        {/* Form or View Mode */}
                        {isEditing ? (
                            <Form onSubmit={handleProfileSubmit(handleProfileFormSubmit)}>
                                <Row className="g-4">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                First Name <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...registerProfile('firstName')}
                                                isInvalid={!!profileErrors.firstName}
                                                disabled={isUpdatingAdmin || isUpdatingTeacher}
                                                className="py-2"
                                                placeholder="Enter first name"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {profileErrors.firstName?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                Last Name <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...registerProfile('lastName')}
                                                isInvalid={!!profileErrors.lastName}
                                                disabled={isUpdatingAdmin || isUpdatingTeacher}
                                                className="py-2"
                                                placeholder="Enter last name"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {profileErrors.lastName?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                Email <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                {...registerProfile('email')}
                                                isInvalid={!!profileErrors.email}
                                                disabled={isUpdatingAdmin || isUpdatingTeacher}
                                                className="py-2"
                                                placeholder="Enter email"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {profileErrors.email?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                Phone <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="tel"
                                                {...registerProfile('phone')}
                                                isInvalid={!!profileErrors.phone}
                                                disabled={isUpdatingAdmin || isUpdatingTeacher}
                                                className="py-2"
                                                placeholder="Enter phone number"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {profileErrors.phone?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                Gender <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Select
                                                {...registerProfile('gender')}
                                                isInvalid={!!profileErrors.gender}
                                                disabled={isUpdatingAdmin || isUpdatingTeacher}
                                                className="py-2"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="M">Male</option>
                                                <option value="F">Female</option>
                                                <option value="O">Other</option>
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {profileErrors.gender?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                Date of Birth <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="date"
                                                {...registerProfile('DOB')}
                                                isInvalid={!!profileErrors.DOB}
                                                disabled={isUpdatingAdmin || isUpdatingTeacher}
                                                className="py-2"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {profileErrors.DOB?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                Address Line 1 <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...registerProfile('address1')}
                                                isInvalid={!!profileErrors.address1}
                                                disabled={isUpdatingAdmin || isUpdatingTeacher}
                                                className="py-2"
                                                placeholder="Enter address"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {profileErrors.address1?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>

                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                Address Line 2
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                {...registerProfile('address2')}
                                                isInvalid={!!profileErrors.address2}
                                                disabled={isUpdatingAdmin || isUpdatingTeacher}
                                                className="py-2"
                                                placeholder="Optional"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {profileErrors.address2?.message}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={handleCancelEdit}
                                        className="px-4"
                                        disabled={isUpdatingAdmin || isUpdatingTeacher}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={isUpdatingAdmin || !isDirty || isUpdatingTeacher}
                                        className="px-4"
                                    >
                                        {(isUpdatingAdmin || isUpdatingTeacher)? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save me-2"></i>
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        ) : (
                            // View Mode - Display profile data as text
                            <div className="profile-view">
                                <Row className="g-4">
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Form.Label className="fw-semibold text-muted small mb-1">
                                                First Name <span className="text-danger">*</span>
                                            </Form.Label>
                                            <p className="fw-medium mb-0">{profileData?.firstName}</p>
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Form.Label className="fw-semibold text-muted small mb-1">
                                                Last Name <span className="text-danger">*</span>
                                            </Form.Label>
                                            <p className="fw-medium mb-0">{profileData?.lastName}</p>
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Form.Label className="fw-semibold text-muted small mb-1">
                                                Email <span className="text-danger">*</span>
                                            </Form.Label>
                                            <p className="fw-medium mb-0">{profileData?.email}</p>
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Form.Label className="fw-semibold text-muted small mb-1">
                                                Phone <span className="text-danger">*</span>
                                            </Form.Label>
                                            <p className="fw-medium mb-0">{profileData?.phone}</p>
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Form.Label className="fw-semibold text-muted small mb-1">
                                                Gender <span className="text-danger">*</span>
                                            </Form.Label>
                                            <p className="fw-medium mb-0">{formatGender(profileData?.gender || "")}</p>
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Form.Label className="fw-semibold text-muted small mb-1">
                                                Date of Birth <span className="text-danger">*</span>
                                            </Form.Label>
                                            <p className="fw-medium mb-0">{profileData?.DOB}</p>
                                        </div>
                                    </Col>

                                    <Col md={12}>
                                        <div className="mb-3">
                                            <Form.Label className="fw-semibold text-muted small mb-1">
                                                Address Line 1 <span className="text-danger">*</span>
                                            </Form.Label>
                                            <p className="fw-medium mb-0">{profileData?.address1}</p>
                                        </div>
                                    </Col>

                                    <Col md={12}>
                                        <div className="mb-3">
                                            <Form.Label className="fw-semibold text-muted small mb-1">
                                                Address Line 2
                                            </Form.Label>
                                            <p className="fw-medium mb-0">{profileData?.address2 || '—'}</p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            ) : (
                // Password Change Form
                <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                        <Form onSubmit={handlePasswordSubmit(handlePasswordFormSubmit)}>
                            <Row className="g-4">
                                <Col md={9}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">
                                            Current Password <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            {...registerPassword('currentPassword')}
                                            isInvalid={!!passwordErrors.currentPassword}
                                            className="py-2"
                                            placeholder="Enter current password"
                                            disabled={isUpdatingPassword}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {passwordErrors.currentPassword?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={9}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">
                                            New Password <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            {...registerPassword('password')}
                                            isInvalid={!!passwordErrors.password}
                                            className="py-2"
                                            placeholder="Enter new password"
                                            disabled={isUpdatingPassword}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {passwordErrors.password?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <PasswordStrengthMeter password={newPassword} />
                                </Col>

                                <Col md={9}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">
                                            Confirm New Password <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            {...registerPassword('confirmPassword')}
                                            isInvalid={!!passwordErrors.confirmPassword}
                                            className="py-2"
                                            placeholder="Confirm new password"
                                            disabled={isUpdatingPassword}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {passwordErrors.confirmPassword?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={9}>
                                    <div className="bg-light p-3 rounded">
                                        <small className="text-muted d-block mb-2">
                                            <i className="fas fa-info-circle me-1"></i>
                                            Password Requirements:
                                        </small>
                                        <ul className="small text-muted mb-0 ps-3">
                                            <li className={newPassword.length >= 8 ? 'text-success' : ''}>
                                                <i className={`fas fa-${newPassword.length >= 8 ? 'check-circle' : 'circle'} me-2`}></i>
                                                At least 8 characters long
                                            </li>
                                            <li className={/[A-Z]/.test(newPassword) ? 'text-success' : ''}>
                                                <i className={`fas fa-${/[A-Z]/.test(newPassword) ? 'check-circle' : 'circle'} me-2`}></i>
                                                Contains uppercase letter (A-Z)
                                            </li>
                                            <li className={/[a-z]/.test(newPassword) ? 'text-success' : ''}>
                                                <i className={`fas fa-${/[a-z]/.test(newPassword) ? 'check-circle' : 'circle'} me-2`}></i>
                                                Contains lowercase letter (a-z)
                                            </li>
                                            <li className={/[0-9]/.test(newPassword) ? 'text-success' : ''}>
                                                <i className={`fas fa-${/[0-9]/.test(newPassword) ? 'check-circle' : 'circle'} me-2`}></i>
                                                Contains number (0-9)
                                            </li>
                                            <li className={/[@$!%*?&#]/.test(newPassword) ? 'text-success' : ''}>
                                                <i className={`fas fa-${/[@$!%*?&#]/.test(newPassword) ? 'check-circle' : 'circle'} me-2`}></i>
                                                Contains special character (@$!%*?&#)
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={isUpdatingPassword}
                                    className="px-4"
                                >
                                    {isUpdatingPassword ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-key me-2"></i>
                                            Update Password
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default ProfilePage;