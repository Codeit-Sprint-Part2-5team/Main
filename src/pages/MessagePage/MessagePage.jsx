import { useState, useEffect } from 'react';
import Inner from '../../components/Inner/Inner';
import * as S from './MessagePage.styled';
import MarkDown from '../../components/TextField/MarkDown';
import Input from '../../components/TextField/Input/Input';
import DropDown from '../../components/TextField/DropDown/DropDown';
import Button from '../../components/Button/Button';
import ProfileImage from '../../components/ProfileImage/ProfileImage';
import ToggleButton from '../../components/ToggleButton/ToggleButton';
import useAsync from '../../hooks/useAsync';
import { createMessageRequest, getMockImageRequest } from '../../apis/api';
import { useNavigate, useParams } from 'react-router-dom';

const INIT_CREATE_MESSAGE = {
  recipientId: 0,
  sender: '',
  profileImageURL:
    'https://learn-codeit-kr-static.s3.ap-northeast-2.amazonaws.com/sprint-proj-image/default_avatar.png',
  relationship: '친구',
  content: '',
  font: 'Noto Sans',
};

export default function MessagePage() {
  const [messageBody, setMessageBody] = useState(INIT_CREATE_MESSAGE);
  const [profileImage, setProfileImage] = useState([]);
  const [selected, setSelected] = useState('');
  const [isActiveBtn, setActiveBtn] = useState(true);
  const [textareaBody, setTextareaBody] = useState('');
  const [profileContext, setProfileContext] = useState('img');
  const { requestFunction: getImageRequest } = useAsync(getMockImageRequest);
  const { requestFunction: postMessageRequest } =
    useAsync(createMessageRequest);
  const nav = useNavigate();
  const { userId } = useParams();

  const INIT_DROPDOWN = {
    relationship: ['친구', '지인', '가족', '동료'],
    font: ['Noto Sans', 'Pretendard', '나눔명조', '나눔손글씨 손편지체'],
  };

  const getImage = async () => {
    const result = await getImageRequest();
    if (!result) return;

    const {
      data: { imageUrls },
    } = result;
    setProfileImage(imageUrls);
  };

  const postMessage = async (e) => {
    e.preventDefault();
    const result = await postMessageRequest(messageBody);
    if (!result) return;

    setMessageBody(INIT_CREATE_MESSAGE);

    nav(`/post/${userId}`);
  };

  const onChangeInputHandler = (e) => {
    setMessageBody({
      ...messageBody,
      [e.target['name']]: e.target.value,
    });
  };

  const onChangeImageHandler = (value) => {
    setMessageBody({
      ...messageBody,
      profileImageURL: value,
    });
  };

  useEffect(() => {
    setSelected(profileImage[0]);
  }, [profileImage]);

  useEffect(() => {
    setMessageBody({
      ...messageBody,
      content: textareaBody,
    });
  }, [textareaBody]);

  useEffect(() => {
    setActiveBtn(messageBody.sender === '' || messageBody.content === '');
  }, [messageBody.sender, messageBody.content]);

  useEffect(() => {
    getImage();
    setMessageBody({
      ...messageBody,
      recipientId: Number(userId),
    });
  }, []);

  return (
    <Inner>
      <S.PostPageLayout>
        <S.FormContainer onSubmit={postMessage}>
          <S.FromContainer>
            <h4>From.</h4>
            <Input
              width={'100%'}
              placeholder={'이름을 입력해 주세요.'}
              name={'sender'}
              onChange={onChangeInputHandler}
              value={messageBody.sender}
            />
          </S.FromContainer>
          <S.ProfileImageContainer>
            <S.ProfileTitle>프로필 이미지</S.ProfileTitle>
            <S.StyledToggleButton
              leftName={'이미지'}
              rightName={'업로드'}
              setContext={setProfileContext}
              left={'img'}
              right={'upload'}
            />
            <S.ProfileImgBox>
              <S.ProfileImg src={selected} />
            </S.ProfileImgBox>
            <S.ProfileP>자신만의 프로필 이미지를 선택하세요!</S.ProfileP>
            {profileContext === 'img' ? (
              <S.ProfileBox>
                {profileImage.map((image) => (
                  <ProfileImage
                    key={image}
                    image={image}
                    size={'m'}
                    setSelected={setSelected}
                    onChange={onChangeImageHandler}
                  />
                ))}
              </S.ProfileBox>
            ) : (
              <S.ProfileBox>
                <Button
                  text={'이미지 업로드'}
                  variant={'secondary'}
                  width={'100%'}
                  size={40}
                />
              </S.ProfileBox>
            )}
          </S.ProfileImageContainer>
          <S.RelationShipContainer>
            <h4>상대와의 관계</h4>
            <DropDown
              items={INIT_DROPDOWN.relationship}
              type={'relationship'}
              messageBody={messageBody}
              setMessageBody={setMessageBody}
            />
          </S.RelationShipContainer>
          <S.TextAreaContainer>
            <h4>내용을 입력해 주세요</h4>
            <MarkDown
              textareaBody={textareaBody}
              setTextareaBody={setTextareaBody}
            />
          </S.TextAreaContainer>
          <S.FontContainer>
            <h4>폰트 선택</h4>
            <DropDown
              items={INIT_DROPDOWN.font}
              type={'font'}
              messageBody={messageBody}
              setMessageBody={setMessageBody}
            />
          </S.FontContainer>
          <Button
            disabled={isActiveBtn}
            variant={'primary'}
            text={'생성하기'}
            size={56}
            width={'100%'}
          />
        </S.FormContainer>
      </S.PostPageLayout>
    </Inner>
  );
}
