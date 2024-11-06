import React, { useState, useEffect } from 'react';
import { Card, Modal, Button, Typography} from 'antd';
import { RecomendDoc } from './RecomendDoc';
import { RecomendTips } from './RecomendTips';
import recommendationApi from "../api/recommendationApi";
const { Text, Link } = Typography;

export const RecomendPage: React.FC = () => {
  const [isDocModalVisible, setIsDocModalVisible] = useState(false);
  const [isTipsModalVisible, setIsTipsModalVisible] = useState(false);
  const [docData, setDocData] = useState(null);
  const [tipsData, setTipsData] = useState(null);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [loadingTips, setLoadingTips] = useState(false);

  let recService = new recommendationApi();

  const showDocModal = () => {
    setIsDocModalVisible(true);
    setLoadingDoc(true);

    recService.recommend()
      .then(response => {
        setDocData(response.data);
      })
      .catch(error => {
        console.error("Error fetching doc data:", error);
      })
      .finally(() => setLoadingDoc(false));
  };

  const showTipsModal = () => {
    setIsTipsModalVisible(true);
    setLoadingTips(true);
    recService.answer()
      .then(response => {
        setTipsData(response.data);
      })
      .catch(error => {
        console.error("Error fetching tips data:", error);
      })
      .finally(() => setLoadingTips(false));
  };

  const closeDocModal = () => {
    setIsDocModalVisible(false);
    setDocData(null); 
  };

  const closeTipsModal = () => {
    setIsTipsModalVisible(false);
    setTipsData(null);
  };

  return (
    <div style={pageStyles.container}>
      <Card title="Therapist Recommendation" style={cardStyles.card}>
        <Text type="secondary">
          Receive a recommendation of the best therapists for you, based on your recent diary data.
        </Text>
        <Button type="primary" onClick={showDocModal} style={cardStyles.button}>
          Get Recommendation
        </Button>
      </Card>

      <Card title="Key Tips" style={cardStyles.card}>
        <Text type="secondary">
          Receive useful tips for actions to help manage your condition effectively.
        </Text>
        <Button type="primary" onClick={showTipsModal} style={cardStyles.button}>
          View Tips
        </Button>
      </Card>

      <Modal
        title="Therapist Recommendation"
        visible={isDocModalVisible}
        onCancel={closeDocModal}
        footer={<Button onClick={closeDocModal}>Close</Button>}
        centered
      >
        {loadingDoc ? <p>Loading...</p> : <RecomendDoc data={docData || []} />}
      </Modal>

      <Modal
        title="Key Tips"
        visible={isTipsModalVisible}
        onCancel={closeTipsModal}
        footer={<Button onClick={closeTipsModal}>Close</Button>}
        centered
      >
        {loadingTips ? <p>Loading...</p> : <RecomendTips data={tipsData} />}
      </Modal>
    </div>
  );
};

// Styling Objects
const pageStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // Align items to the top
    gap: '20px',
    padding: '40px',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  } as React.CSSProperties,
};

const cardStyles = {
  card: {
    width: 350,
    height: 250, // Fixed height for consistent sizing
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Space out content vertically within the card
    textAlign: 'center',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  } as React.CSSProperties,
  button: {
    width: '100%',
    marginTop: '15px',
  } as React.CSSProperties,
};