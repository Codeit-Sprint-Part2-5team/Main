import * as S from './ColorOption.styled';
import checkicon from '../../assets/images/Check.svg';
import convertBackgroundColor from '../../utils/convertBackgroundColor';

export default function ColorOption({
  background,
  select,
  setSelect,
  isLoading,
}) {
  const isActive = select === background;

  const onChangeActive = () => {
    setSelect(background);
  };

  const convertColor = () => {
    if (background.includes('http')) {
      return background;
    }
    return convertBackgroundColor(background);
  };

  return (
    <>
      {isLoading ? (
        <S.LoadingBox></S.LoadingBox>
      ) : (
        <S.ColorOptionLayout
          $background={convertColor(background)}
          $isActive={isActive}
          onClick={onChangeActive}
        >
          <S.IconBox>
            <S.CheckIcon src={checkicon} />
          </S.IconBox>
        </S.ColorOptionLayout>
      )}
    </>
  );
}
