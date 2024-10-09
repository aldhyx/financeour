import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { HeaderBar } from '@/components/ui/header-bar';
import {
  ChartColumnBigIcon,
  ChartPieIcon,
  HomeIcon,
  PlusIcon,
  UserRoundIcon,
} from '@/components/ui/icon';
import { translate } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const tabIcons = {
  home: HomeIcon,
  profile: UserRoundIcon,
  reports: ChartColumnBigIcon,
  budgets: ChartPieIcon,
  plus: PlusIcon,
};

const TabBarIcon = (props: {
  focused: boolean;
  icon: keyof typeof tabIcons;
}) => {
  const router = useRouter();
  const SelectedIcon = tabIcons[props.icon];

  if (props.icon === 'plus') {
    return (
      <Pressable
        onPress={() => router.push('/(transaction)/create')}
        className="items-center justify-center px-5 active:opacity-50"
      >
        <View className="h-8 w-14 items-center justify-center rounded-full bg-primary">
          <SelectedIcon className="text-background" />
        </View>
      </Pressable>
    );
  }

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
          borderTopWidth: 0,
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
        name="add"
        options={{
          title: 'Create',
          tabBarShowLabel: false,
          tabBarButton: () => <TabBarIcon focused={false} icon="plus" />,
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
