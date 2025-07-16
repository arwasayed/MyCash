import React, { useState } from 'react';
import ChallengeModal from './Challenge/Challenge';
import AddBadgeModel from './AddBadge/AddBadge';
import UpdateChallengeModal from './UpdateChallenge/UpdateChallenge';
import UpdateBadgeModel from './UpdateBadge/UpdateBadge';
import DeleteConfirmModal from './Delete/Delete';

const ChallengesPage = () => {
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [UpdateChallenge, setUpdateChallengModel] = useState(false);
  const [UpdateBadge, setUpdateBadgeModel] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openDeleteModal = (target) => {
    setDeleteTarget(target);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget === 'challenge') {
      // هنا منطق حذف التحدي
      console.log("تم حذف التحدي");
    } else if (deleteTarget === 'badge') {
      // هنا منطق حذف البادج
      console.log("تم حذف البادج");
    }
    closeDeleteModal();
  };

  return (
    <div className="container py-5">
      <h3 className="mb-4 text-end">إدارة التحديات</h3>

      <button
        className="btn btn-primary float-end ms-2"
        onClick={() => setShowChallengeModal(true)}
      >
        إضافة تحدي جديد
      </button>

      <button
        className="btn btn-secondary float-end"
        onClick={() => setShowBadgeModal(true)}
      >
        إضافة بادج
      </button>

      <button
        className="btn btn-secondary float-end"
        onClick={() => setUpdateChallengModel(true)}
      >
        تعديل تحدي
      </button>

      <button
        className="btn btn-secondary float-end"
        onClick={() => setUpdateBadgeModel(true)}
      >
        تعديل بادج
      </button>

      {/* أزرار حذف جديدة () */}
      <button
        className="btn btn-danger float-end ms-2"
        onClick={() => openDeleteModal('challenge')}
      >
        حذف تحدي
      </button>

      <button
        className="btn btn-danger float-end ms-2"
        onClick={() => openDeleteModal('badge')}
      >
        حذف بادج
      </button>

      {/* مودالات الإدارة */}
      <ChallengeModal
        show={showChallengeModal}
        handleClose={() => setShowChallengeModal(false)}
      />
      <AddBadgeModel
        show={showBadgeModal}
        handleClose={() => setShowBadgeModal(false)}
      />
      <UpdateChallengeModal
        show={UpdateChallenge}
        handleClose={() => setUpdateChallengModel(false)}
      />
      <UpdateBadgeModel
        show={UpdateBadge}
        handleClose={() => setUpdateBadgeModel(false)}
      />

      {/* مودال تأكيد الحذف */}
      <DeleteConfirmModal
        show={showDeleteModal}
        onCancel={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ChallengesPage;
