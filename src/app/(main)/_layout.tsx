import { Tabs } from 'expo-router';
import React from 'react';

import {
  ChartColumnBigIcon,
  ChartPieIcon,
  HomeIcon,
  Text,
  UserRoundIcon,
} from '@/components/ui';
import { translate } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const tabIcons = {
  home: HomeIcon,
  profile: UserRoundIcon,
  reports: ChartColumnBigIcon,
  budgets: ChartPieIcon,
};

const TabBarLabel = (props: { focused: boolean; children: string }) => (
  <Text className={cn([props.focused ? 'font-semibold' : 'opacity-80'])}>
    {props.children}
  </Text>
);

const TabBarIcon = (props: {
  focused: boolean;
  icon: keyof typeof tabIcons;
}) => {
  const SelectedIcon = tabIcons[props.icon];

  return (
    <SelectedIcon
      className={cn([
        'text-foreground dark:text-background',
        !props.focused && 'opacity-80',
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
        headerTitleStyle: {
          left: -5,
        },
        headerShadowVisible: false,
      }}
      initialRouteName="home"
    >
      <Tabs.Screen
        name="home"
        options={{
          title: translate('bottom_nav.home'),
          tabBarLabel: TabBarLabel,
          tabBarIcon: (props) => (
            <TabBarIcon focused={props.focused} icon="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: translate('bottom_nav.report'),
          tabBarLabel: TabBarLabel,
          tabBarIcon: (props) => (
            <TabBarIcon focused={props.focused} icon="reports" />
          ),
        }}
      />

      <Tabs.Screen
        name="budget"
        options={{
          title: translate('bottom_nav.budget'),
          tabBarLabel: TabBarLabel,
          tabBarIcon: (props) => (
            <TabBarIcon focused={props.focused} icon="budgets" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: translate('bottom_nav.profile'),
          tabBarLabel: TabBarLabel,
          tabBarIcon: (props) => (
            <TabBarIcon focused={props.focused} icon="profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
