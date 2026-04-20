import { Modal } from "./Modal";
import { Button } from "./Button";

export function ConfirmDialog({ open, title, description, confirmLabel = "Confirm", loading, onConfirm, onClose }) {
  return (
    <Modal
      open={open}
      title={title}
      description={description}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-slate-600">This action updates your workspace immediately.</p>
    </Modal>
  );
}
