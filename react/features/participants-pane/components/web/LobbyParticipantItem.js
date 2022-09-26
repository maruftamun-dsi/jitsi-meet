// @flow

import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ContextMenu, ContextMenuItemGroup } from '../../../base/components';
import { IconChat, IconCloseCircle, IconHorizontalPoints } from '../../../base/icons';
import { hasRaisedHand } from '../../../base/participants';
import { BUTTON_TYPES } from '../../../base/react/constants';
import Button from '../../../base/ui/components/web/Button';
import { showLobbyChatButton } from '../../../lobby/functions';
import { ACTION_TRIGGER, MEDIA_STATE } from '../../constants';
import { useLobbyActions } from '../../hooks';

import ParticipantItem from './ParticipantItem';

type Props = {

    /**
     * If an overflow drawer should be displayed.
     */
    overflowDrawer: boolean,

    /**
     * Callback used to open a drawer with admit/reject actions.
     */
    openDrawerForParticipant: Function,

    /**
     * Participant reference.
     */
    participant: Object
};

const useStyles = makeStyles(theme => {
    return {
        button: {
            marginRight: `${theme.spacing(2)}px`
        },
        moreButton: {
            paddingRight: '6px',
            paddingLeft: '6px',
            marginRight: `${theme.spacing(2)}px`
        },
        contextMenu: {
            position: 'fixed',
            top: 'auto',
            marginRight: '8px'
        }
    };
});

export const LobbyParticipantItem = ({
    overflowDrawer,
    participant: p,
    openDrawerForParticipant
}: Props) => {
    const { id } = p;
    const [ admit, reject, chat ] = useLobbyActions({ participantID: id });
    const { t } = useTranslation();
    const [ isOpen, setIsOpen ] = useState(false);
    const styles = useStyles();

    const showChat = useSelector(showLobbyChatButton(p));

    const moreButtonRef = useRef();

    const openContextMenu = useCallback(() => setIsOpen(true));
    const closeContextMenu = useCallback(() => setIsOpen(false));

    const renderAdmitButton = () => (
        <Button
            accessibilityLabel = { `${t('lobby.admit')} ${p.name}` }
            className = { styles.button }
            label = { t('lobby.admit') }
            onClick = { admit }
            size = 'small'
            testId = { `admit-${id}` } />);

    return (
        <ParticipantItem
            actionsTrigger = { ACTION_TRIGGER.PERMANENT }
            audioMediaState = { MEDIA_STATE.NONE }
            displayName = { p.name }
            local = { p.local }
            openDrawerForParticipant = { openDrawerForParticipant }
            overflowDrawer = { overflowDrawer }
            participantID = { id }
            raisedHand = { hasRaisedHand(p) }
            videoMediaState = { MEDIA_STATE.NONE }
            youText = { t('chat.you') }>

            {showChat ? <>
                {renderAdmitButton()}
                <Button
                    accessibilityLabel = { `${t('participantsPane.actions.moreModerationActions')} ${p.name}` }
                    className = { styles.moreButton }
                    icon = { IconHorizontalPoints }
                    onClick = { openContextMenu }
                    ref = { moreButtonRef }
                    size = 'small' />
                <ContextMenu
                    className = { styles.contextMenu }
                    hidden = { !isOpen }
                    offsetTarget = { moreButtonRef.current }
                    onMouseLeave = { closeContextMenu }>
                    <ContextMenuItemGroup
                        actions = { [ {
                            accessibilityLabel: `${t('lobby.chat')} ${p.name}`,
                            onClick: chat,
                            testId: `lobby-chat-${id}`,
                            icon: IconChat,
                            text: t('lobby.chat')
                        } ] } />
                    <ContextMenuItemGroup
                        actions = { [ {
                            accessibilityLabel: `${t('lobby.reject')} ${p.name}`,
                            onClick: reject,
                            testId: `reject-${id}`,
                            icon: IconCloseCircle,
                            text: t('lobby.reject')
                        } ] } />
                </ContextMenu>
            </> : <>
                <Button
                    accessibilityLabel = { `${t('lobby.reject')} ${p.name}` }
                    className = { styles.button }
                    label = { t('lobby.reject') }
                    onClick = { reject }
                    size = 'small'
                    testId = { `reject-${id}` }
                    type = { BUTTON_TYPES.DESTRUCTIVE } />
                {renderAdmitButton()}
            </>
            }
        </ParticipantItem>
    );
};
