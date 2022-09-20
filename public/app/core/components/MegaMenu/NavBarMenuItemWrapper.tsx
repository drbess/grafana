import { css } from '@emotion/css';
import { useLingui } from '@lingui/react';
import React from 'react';

import { GrafanaTheme2, NavModelItem } from '@grafana/data';
import { toIconName, useStyles2 } from '@grafana/ui';

import { NavBarItemIcon } from '../NavBar/NavBarItemIcon';
import { NavFeatureHighlight } from '../NavBar/NavFeatureHighlight';
import menuItemTranslations from '../NavBar/navBarItem-translations';
import { isMatchOrChildMatch } from '../NavBar/utils';

import { NavBarMenuItem } from './NavBarMenuItem';
import { NavBarMenuSection } from './NavBarMenuSection';

export function NavBarMenuItemWrapper({
  link,
  activeItem,
  onClose,
}: {
  link: NavModelItem;
  activeItem?: NavModelItem;
  onClose: () => void;
}) {
  const { i18n } = useLingui();
  const styles = useStyles2(getStyles);

  if (linkHasChildren(link)) {
    return (
      <NavBarMenuSection link={link} activeItem={activeItem}>
        <ul className={styles.children}>
          {link.children.map((childLink) => {
            const icon = childLink.icon ? toIconName(childLink.icon) : undefined;
            return (
              !childLink.divider && (
                <NavBarMenuItem
                  key={`${link.text}-${childLink.text}`}
                  isActive={isMatchOrChildMatch(childLink, activeItem)}
                  isChild
                  icon={childLink.showIconInNavbar ? icon : undefined}
                  onClick={() => {
                    childLink.onClick?.();
                    onClose();
                  }}
                  target={childLink.target}
                  url={childLink.url}
                >
                  {childLink.text}
                </NavBarMenuItem>
              )
            );
          })}
        </ul>
      </NavBarMenuSection>
    );
  } else if (link.emptyMessageId) {
    const emptyMessageTranslated = i18n._(menuItemTranslations[link.emptyMessageId]);
    return (
      <NavBarMenuSection link={link}>
        <ul className={styles.children}>
          <div className={styles.emptyMessage}>{emptyMessageTranslated}</div>
        </ul>
      </NavBarMenuSection>
    );
  } else {
    const FeatureHighlightWrapper = link.highlightText ? NavFeatureHighlight : React.Fragment;
    return (
      <NavBarMenuItem
        isActive={activeItem === link}
        icon={link.showIconInNavbar ? link.icon && toIconName(link.icon) : undefined}
        onClick={() => {
          link.onClick?.();
          onClose();
        }}
        target={link.target}
        url={link.url}
      >
        <div className={styles.itemWithoutMenuContent}>
          <div className={styles.iconContainer}>
            <FeatureHighlightWrapper>
              <NavBarItemIcon link={link} />
            </FeatureHighlightWrapper>
          </div>
          <span className={styles.linkText}>{link.text}</span>
        </div>
      </NavBarMenuItem>
    );
  }
}

const getStyles = (theme: GrafanaTheme2) => ({
  children: css({
    display: 'flex',
    flexDirection: 'column',
  }),
  flex: css({
    display: 'flex',
  }),
  itemWithoutMenu: css({
    position: 'relative',
    placeItems: 'inherit',
    justifyContent: 'start',
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
  }),
  fullWidth: css({
    height: '100%',
    width: '100%',
  }),
  iconContainer: css({
    display: 'flex',
    placeContent: 'center',
  }),
  itemWithoutMenuContent: css({
    display: 'grid',
    gridAutoFlow: 'column',
    gridTemplateColumns: `${theme.spacing(7)} auto`,
    alignItems: 'center',
    height: '100%',
  }),
  linkText: css({
    fontSize: theme.typography.pxToRem(14),
    justifySelf: 'start',
  }),
  emptyMessage: css({
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    padding: theme.spacing(1, 1.5),
  }),
});

function linkHasChildren(link: NavModelItem): link is NavModelItem & { children: NavModelItem[] } {
  return Boolean(link.children && link.children.length > 0);
}