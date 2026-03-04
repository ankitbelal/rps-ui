import React, { useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Student } from "../../../../features/admin/students/utils";
import { Teacher } from "../../../../features/admin/teacher/utils";
import { useSendSingleUserNoticeMutation } from "../../../../features/admin/management/mamagementApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { notificationSchema } from "../validations/notificationSchema";
import toast from "react-hot-toast";

interface SendNotificationModalProps {
  show: boolean;
  onHide: () => void;
  id: number | null;
  userType: string;
  user?: Student | Teacher;
}

interface NotificationFormData {
  subject: string;
  description: string;
  sendEmail: boolean;
}


const SendNotificationModal: React.FC<SendNotificationModalProps> = ({
  show,
  onHide,
  id,
  userType,
  user,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NotificationFormData>({
    resolver: yupResolver(notificationSchema),
    defaultValues: {
      subject: "",
      description: "",
      sendEmail: false,
    },
  });

  const [sendNotice, { isLoading: isSendingNotice }] =
    useSendSingleUserNoticeMutation();

  const handleFormSubmit = async (data: NotificationFormData) => {
    try {
      const payload = {
        recipientId: id,
        recipientType:userType,
        subject: data.subject,
        description: data.description,
        sendEmail: data.sendEmail,
      }

      console.log("Payload data: ", payload);
      const response = await toast.promise(sendNotice(payload).unwrap(),{
        loading:"sending notice..."
      });
      if(response.success){
        toast.success(response.message);
        onHide();
      }
    } catch (error:any) {
      const errorMessage = error?.data?.message || "Failed to send notification";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (!show) {
      reset({
        subject: "",
        description: "",
        sendEmail: false,
      });
    }
  }, [show, reset]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title className="fw-bold w-100">
          <div className="d-flex align-items-center gap-3 mb-2">
            <div
              className="bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: "44px", height: "44px" }}
            >
              <i className="fas fa-bell text-white fs-5"></i>
            </div>
            <div>
              <h5 className="mb-0">Send Notification</h5>
              <small className="text-muted">
                {user
                  ? `Sending notification to ${user.firstName} ${user.lastName}`
                  : "Compose your notification message"}
              </small>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Subject <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              {...register("subject")}
              isInvalid={!!errors.subject}
              placeholder="Enter notification subject"
              className="py-2"
            />
            {errors.subject && (
              <Form.Control.Feedback type="invalid">
                {errors.subject.message}
              </Form.Control.Feedback>
            )}
            <Form.Text className="text-muted">
              Brief title for your notification (3-200 characters)
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">
              Description <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              {...register("description")}
              isInvalid={!!errors.description}
              placeholder="Enter notification description"
              rows={5}
              className="py-2"
            />
            {errors.description && (
              <Form.Control.Feedback type="invalid">
                {errors.description.message}
              </Form.Control.Feedback>
            )}
            <Form.Text className="text-muted">
              Detailed message (10-2000 characters)
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              {...register("sendEmail")}
              id="sendEmailCheckbox"
              label={
                <span className="fw-semibold">
                  Send email notification to recipients
                </span>
              }
              className="mt-2"
            />
            <Form.Text className="text-muted d-block mt-1">
              An email notification will be triggered to selected recipients
              once the notification is sent.
            </Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="border-top-0">
          <Button
            variant="outline-secondary"
            onClick={onHide}
            className="px-4"
            disabled={isSendingNotice}
          >
            <i className="fas fa-times me-2"></i>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSendingNotice}
            className="px-4"
          >
            {isSendingNotice ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i>
                Send Notification
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SendNotificationModal;