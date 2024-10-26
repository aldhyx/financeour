import { Tabs, useRouter } from 'expo-router';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { HeaderBar } from '@/components/ui/header-bar';
import {
  ChartColumnBigIcon,
  ChartPieIcon,
  HomeIcon,
  PlusIcon,
  SettingsIcon,
  UserRoundIcon,
} from '@/components/ui/icon';
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
        className="items-center justify-center px-5 active:opacity-50 "
      >
        <View className="h-8 w-14 items-center justify-center rounded-full bg-foreground">
          <SelectedIcon className="text-background" />
        </View>
      </Pressable>
    );
  }

  return (
    <SelectedIcon
      className={cn([
        'text-foreground',
        props.focused ? 'text-foreground' : 'opacity-70',
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
          title: 'Financeour',
          tabBarShowLabel: false,
          tabBarIcon: (props) => (
            <TabBarIcon focused={props.focused} icon="home" />
          ),
        }}
      />

      <Tabs.Screen
        name="report"
        options={{
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
          tabBarShowLabel: false,
          tabBarIcon: (props) => (
            <TabBarIcon focused={props.focused} icon="budgets" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: (props) => (
            <TabBarIcon focused={props.focused} icon="profile" />
          ),
          header({ options }) {
            return (
              <HeaderBar
                title={options.title}
                rightIcon={
                  <Link push href="/settings" asChild>
                    <Button
                      variant="ghost"
                      size="icon-md"
                      rounded="full"
                      style={{ right: -6 }}
                    >
                      <SettingsIcon size={20} className="text-foreground" />
                    </Button>
                  </Link>
                }
              />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
