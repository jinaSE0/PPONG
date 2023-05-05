import styled from 'styled-components';
import ICON_PROFILE from '../../assets/ic_mypage_profile.svg';
import ButtonStyled from '../../components/ButtonStyled';
import { ReactComponent as ICON_LIKE } from '../../assets/ic_boardItem_like.svg';
import { ReactComponent as ICON_MENU } from '../../assets/ic_answer_menubutton.svg';
import SubAnswer from './SubAnswer';
import CommentForm from './CommentForm';
import { getUser } from '../../utils/getUser';
import MenuButton from '../../components/MenuButton';
import { useState } from 'react';
import axios from 'axios';
import getCookie from '../../utils/cookieUtils';

//필수 타입 ? 제거하기
interface AnswerCardProps {
  nickname: string;
  createdAt: string;
  likeCount: number;
  answerStatus: string;
  content: string;
  comments?: [];
  memberId: number;
  questionId: number;
  answerId: number;
  profileImageUrl: string;
  postMemberId: number;
  likeCheck: boolean;
}
//임의로 넣어놓은 데이터값도 제거하기
const Answer = ({ postMemberId, likeCount, profileImageUrl, nickname, createdAt, answerStatus, content, comments, memberId, answerId, questionId, likeCheck }: AnswerCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);

  const answerDelete = async () => {
    if (memberId === Number(getUser()?.memberId())) {
      try {
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/questions/${questionId}/${answerId}?memberId=${memberId}`, { headers: { Authorization: getCookie('accessToken') } });
        alert('삭제되었습니다.');
        return window.location.replace(`/questions/${questionId}`);
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  };

  const parseDate = (props: Date) => {
    const now = new Date(props);
    const MM = Number(now.getMonth() + 1) < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
    const dd = Number(now.getDate()) < 10 ? `0${now.getDate()}` : now.getDate();
    return `${MM}/${dd}`;
  };

  const likeButton = async () => {
    const data = {
      memberId: getUser()?.memberId(),
      questionId,
      answerId,
    };
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/questions/${questionId}/${answerId}/likes`, data, { headers: { Authorization: getCookie('accessToken') } });
      window.location.replace(`/questions/${questionId}`);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const changeAnswerState = async () => {
    if (memberId !== Number(getUser()?.memberId())) {
      if (window.confirm(answerStatus === '일반 상태' ? '채택하시겠습니까?' : '채택을 취소하시겠습니까?')) {
        const data = {
          memberId: getUser()?.memberId(),
          questionId,
        };
        try {
          await axios.patch(`${process.env.REACT_APP_BASE_URL}/questions/${questionId}/answers/${answerId}/select?memberId=${getUser()?.memberId()}`, data, { headers: { Authorization: getCookie('accessToken') } });
          alert(answerStatus === '일반 상태' ? '채택되었습니다.' : '취소되었습니다.');
          return window.location.replace(`/questions/${questionId}`);
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    }
  };

  return (
    <>
      <AnswerWrapper>
        <ImageWrapper>
          <img src={profileImageUrl === null ? ICON_PROFILE : profileImageUrl} alt="profile_image" />
        </ImageWrapper>
        <TextWrapper>
          <TopWrapper>
            <InfoWrapper>
              <NameWrapper>{nickname}</NameWrapper>
              <TimeWrapper>{parseDate(new Date(createdAt))}</TimeWrapper>
            </InfoWrapper>
            <TopRightWrapper>
              {postMemberId === getUser()?.memberId() && memberId !== getUser()?.memberId() && (
                <ButtonStyled color={answerStatus === '일반 상태' ? 'pink' : 'normal'} title={answerStatus === '일반 상태' ? '채택중' : '채택완료'} width="55px" height="22px" buttonClickHandler={changeAnswerState} />
              )}
              {memberId === getUser()?.memberId() && (
                <>
                  <ICON_MENU onClick={() => setIsMenuOpen(!isMenuOpen)} />
                  {isMenuOpen === true ? (
                    <MenuButton
                      menu={[
                        {
                          title: '수정',
                          button: function () {
                            console.log('수정');
                          },
                        },
                        {
                          title: '삭제',
                          button: function () {
                            if (window.confirm('정말 삭제 하시겠습니까?')) {
                              setIsMenuOpen(false);
                              return answerDelete();
                            }
                          },
                        },
                      ]}
                    />
                  ) : null}
                </>
              )}
            </TopRightWrapper>
          </TopWrapper>
          <MiddleWrapper>{content}</MiddleWrapper>
          <BottomWrapper>
            <BottomLeftWrapper>
              <LikeWrapper onClick={() => likeButton()}>
                {likeCheck ? <ICON_LIKE stroke="#FF607C" fill="#FF607C" /> : <ICON_LIKE stroke="#ABAEB4" fill="none" />}
                <LikeNumber>{likeCount}</LikeNumber>
              </LikeWrapper>
              <SubAnswerButton onClick={() => setCommentOpen(!commentOpen)}>답글쓰기</SubAnswerButton>
            </BottomLeftWrapper>
          </BottomWrapper>
          {commentOpen && <CommentForm questionId={questionId} answerId={answerId} />}
        </TextWrapper>
      </AnswerWrapper>
      {comments?.length !== 0 &&
        comments?.map((el: any, index) => {
          return <SubAnswer key={index} questionId={questionId} {...el} />;
        })}
    </>
  );
};

export default Answer;

const AnswerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 8px;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;

  img {
    width: 36px;
    height: 36px;
    object-fit: cover;
    border-radius: 50%;
    background-color: var(--color-gray04);
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  gap: 8px;
`;

const TopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 5px;
`;

const NameWrapper = styled.div`
  color: var(--color-black01);
  font-weight: var(--font-weight700);
  font-size: var(--font-size12);
`;

const TimeWrapper = styled.div`
  color: var(--color-gray02);
  font-weight: var(--font-weight300);
  font-size: var(--font-size12);
`;

const TopRightWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  svg {
    padding-left: 10px;
  }
  /* gap: 0.625rem; */
`;

const MiddleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  line-height: 22.4px;
  font-weight: var(--font-weight300);
  margin-left: 5px;
`;
const BottomWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-left: 5px;
`;

const LikeWrapper = styled.div`
  border: none;
  background-color: #fff;
  cursor: pointer;
  user-select: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 2px;
  align-items: center;
`;

const LikeNumber = styled.div`
  font-weight: var(--font-weight700);
  font-size: var(--font-size12);
  color: var(--color-gray02);
`;

const SubAnswerButton = styled.span`
  cursor: pointer;
  user-select: none;
  font-weight: var(--font-weight700);
  font-size: var(--font-size12);
  color: var(--color-gray02);
`;

const BottomLeftWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`;
