import axios from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';
import ANSWER_ICON from '../../assets/ic_boardItem_answer.svg';
import LIKE_ICON from '../../assets/ic_boardItem_like.svg';
import { ReactComponent as ICON_LIKE } from '../../assets/ic_boardItem_like.svg';
import getCookie from '../../utils/cookieUtils';
import { getUser } from '../../utils/getUser';

const CountsBar = ({ answer, likeCount, answerHandler, isTextarea, questionId, likeCheck }: { answer: number; likeCount: number; answerHandler: Dispatch<SetStateAction<boolean>>; isTextarea: boolean; questionId: number; likeCheck: boolean }) => {
  const likeButton = async () => {
    const data = {
      memberId: getUser()?.memberId(),
      questionId,
    };
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/questions/${questionId}/likes`, data, { headers: { Authorization: getCookie('accessToken') } });
      window.location.replace(`/questions/${questionId}`);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return (
    <CountsBarWrapper>
      <AnswerWrapper onClick={() => answerHandler(!isTextarea)}>
        <img src={ANSWER_ICON} alt="답글아이콘"></img>
        <AnswerKey>댓글</AnswerKey>
        <AnswerValue>{answer}</AnswerValue>
      </AnswerWrapper>
      <LikeWrapper onClick={() => likeButton()}>
        {likeCheck ? <ICON_LIKE stroke="#FF607C" fill="#FF607C" /> : <ICON_LIKE stroke="#ABAEB4" fill="none" />}
        <LikeKey>좋아요</LikeKey>
        <LikeValue>{likeCount}</LikeValue>
      </LikeWrapper>
    </CountsBarWrapper>
  );
};

export default CountsBar;

const CountsBarWrapper = styled.div`
  user-select: none;
  border-top: solid 0.5px var(--color-gray03);
  border-bottom: solid 0.5px var(--color-gray03);
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 42px;
  margin-bottom: 12px;
`;
const AnswerWrapper = styled.div`
  border: none;
  background-color: var(--color-white01);
  cursor: pointer;
  display: flex;
  padding: 0 0 0 24px;
  gap: 5.5px;
`;

const AnswerKey = styled.div`
  color: var(--color-gray01);
  font-size: var(--font-size14);
`;
const AnswerValue = styled.div`
  color: var(--color-gray01);
  font-size: var(--font-size12);
`;

const LikeWrapper = styled.button`
  border: none;
  background-color: var(--color-white01);
  cursor: pointer;
  display: flex;
  gap: 5.5px;
`;

const LikeKey = styled.div`
  color: var(--color-gray01);
  font-size: var(--font-size14);
`;
const LikeValue = styled.div`
  color: var(--color-gray01);
  font-size: var(--font-size12);
`;
