import styled from 'styled-components';

const TierInfo = () => {
  return (
    <MenuButtonWrapper>
      <EditDeleteContainer>
        <ul>
          <li>활동 점수에 따라 티어가 올라갑니다.</li>
          <li>돌 / 동 / 금 / 은 / 뿅</li>
        </ul>
      </EditDeleteContainer>
    </MenuButtonWrapper>
  );
};
export default TierInfo;

const MenuButtonWrapper = styled.div`
  position: relative;
`;

const EditDeleteContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: nowrap;
  padding: 10px 18px 10px 18px;
  left: -130px;
  top: 15px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--color-gray03);
  font-size: var(--font-size14);
  color: var(--color-gray02);
  z-index: 100;
  li {
    margin-bottom: 5px;
  }
`;
