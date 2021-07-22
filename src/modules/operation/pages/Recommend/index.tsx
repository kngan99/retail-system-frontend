import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { pageSizeOptions } from '../../../../common/constants/paging.constants';
import { I18N } from '../../../../i18n.enum';
import { ActionBarDto } from '../../../theme/theme.dto';
import ActionBar from '../../../theme/components/ActionBar';
import { message } from 'antd';
import RecommendListProduct from '../../components/RecommendListProduct';
import AdminWrapper from '../../components/AdminWrapper';
import RecommendExcel from '../../components/RecommendExcel';

const RecommendPage = () => {
  const history = useHistory();
  /*
   * Translation
   */
  const {
    ADMIN_MANAGE_PRODUCT,
    BUTTONS_ADD_NEW,
    MESSAGES_CREATED_SUCCESS,
    MESSAGES_UPDATE_SUCCESS,
    BUTTONS_RESTORE,
  } = I18N;

  const [showPopup, setShowPopup] = React.useState<boolean>(false);

  const [mode, setMode] = React.useState<string>('create');

  const [id, setId] = React.useState<number>(-1);

  
  const [criteriaDto, setCriteriaDto] = React.useState<any>({
    skip: 0,
    take: +pageSizeOptions[0],
    orderDirection: 'DESC',
  });

  const handleChangePageItem = (page: number) => {
    setCriteriaDto({
      skip: page > 1 ? (page - 1) * +pageSizeOptions[0] : 0,
      take: +pageSizeOptions[0],
      orderDirection: 'DESC',
    });
  };

  return (
    <>
      <AdminWrapper pageTitle={'Recommend Products Positions'}>
        {/* <ActionBar actions={actionsBar} /> */}
        <RecommendExcel/>
        <RecommendListProduct />
      </AdminWrapper>
    </>
  );
};

export default observer(RecommendPage);
