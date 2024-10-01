import { Tabs } from 'expo-router';
import React from 'react';

import {
  ChartColumnBigIcon,
  ChartPieIcon,
  HomeIcon,
  UserRoundIcon,
} from '@/components/ui';
import { HeaderBar } from '@/components/ui/header-bar';
import { translate } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const tabIcons = {
  home: HomeIcon,
  profile: UserRoundIcon,
  reports: ChartColumnBigIcon,
  budgets: ChartPieIcon,
};

const TabBarIcon = (props: {
  focused: boolean;
  icon: keyof typeof tabIcons;
}) => {
  const SelectedIcon = tabIcons[props.icon];

  return (
    <SelectedIcon
      className={cn([
        'text-foreground',
        props.focused ? 'text-primary' : 'opacity-80',
      ])}
    />
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 56,
          elevation: 0,
          paddingTop: 12,
          paddingBottom: 4,
        },
        header({ options }) {
          return <HeaderBar title={options.title} />;
        },
      }}
      initialRouteName="home"
    >
      <Tabs.Screen
        name="home"
        options={{
          title: translate('bottom_nav.home'),
          tabBarShowLabel: false,
          tabBarIcon: (props) => (
            <TabBarIcon focused={props.focused} icon="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: translate('bottom_nav.report'),
          tabBarShowLabel: false,
          tabBarIcon: (props) => (
            <TabBarIcon focused={props.focused} icon="reports" />
          ),
        }}
      />

      <Tabs.Screen
        name="budget"
        options={{
          title: translate('bottom_nav.budget'),
          tabBarShowLabel: false,
          tabBarIcon: (props) => (
            <TabBarIcon focused={props.focused} icon="budgets" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: translate('bottom_nav.profile'),
          tabBarShowLabel: false,
          tabBarIcon: (props) => (
            <TabBarIcon focused={props.focused} icon="profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
