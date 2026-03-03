import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Student } from "../../../../features/admin/students/utils";
import { Teacher } from "../../../../features/admin/teacher/utils";

interface SendNotificationModalProps {
  show: boolean;
  onHide: () => void;
  onSend: (notificationData: NotificationData) => void;
  user?: Student | Teacher;
}

interface NotificationData {
  subject: string;
  description: string;
  sendEmail: boolean;
  program?: string;
  recipients?: string[];
}

const SendNotificationModal: React.FC<SendNotificationModalProps> = ({
  show,
  onHide,
  onSend,
  user,
}) => {
  const [notificationData, setNotificationData] = useState<NotificationData>({
    subject: "",
    description: "",
    sendEmail: false,
    program: "",
  });

  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setNotificationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleRecipientSelect = (recipient: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(recipient)
        ? prev.filter((r) => r !== recipient)
        : [...prev, recipient],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend({
      ...notificationData,
      recipients: selectedRecipients,
    });
    onHide();
  };

  const recipientGroups = [
    "All Students",
    "All Teachers",
    "All Staff",
    "BCA Students",
    "MCA Students",
    "B.Tech Students",
  ];

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Send Notification {user && `to ${user.firstName} ${user.lastName}`}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              Subject <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={notificationData.subject}
              onChange={handleInputChange}
              placeholder="Enter notification subject"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Description <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={notificationData.description}
              onChange={handleInputChange}
              placeholder="Enter notification description"
              required
              rows={5}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="sendEmail"
              id="sendEmailCheckbox"
              label="Send email notification to recipients"
              checked={notificationData.sendEmail}
              onChange={handleCheckboxChange}
            />
            <Form.Text className="text-muted d-block mt-1">
              An email notification will be triggered to selected recipients as
              once the notification is sent.
            </Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between align-items-center">
          <div>
            <span className="text-muted">
              {selectedRecipients.length} recipient
              {selectedRecipients.length !== 1 ? "s" : ""} selected
            </span>
          </div>
          <div>
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Send Notification
            </Button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SendNotificationModal;
