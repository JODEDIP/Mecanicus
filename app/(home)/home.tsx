import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ServiceScreen() {
  const services = [
    {
      title: "Flat Tire",
      description: "We'll replace your tire with your spare.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD8r1hIhg1pT7fyb-FfXJA9EtNBBlgMmWzo9pcNRj3Trq_OO2-8P6E5PGzi-joAV0O7BikE8gLxqNWnFqIiyrWrjd9JZC_ucN8R9wgzOveTCo3bog9xUIOyZVdnSBDDQZuq9ukX5QoPN_0F9IAswPhlBEshV1DUhwyl9x67apb6xW9tRj4r5Te222-o9K_RQUxSkjSH_eLdN7hCQS5obhatT8L85xj12k87X-OZ8Ok2Mp6hMQHTp9pTOCyUTQIKC6iop4pJY2zpMA",
    },
    {
      title: "Electrical Issue",
      description: "We'll diagnose and fix any electrical problems.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDENPRhr0-yIdry4L5efijMiigeGVimsTwZYsAU3X8LFErFRNFA2foBz0Lw0qEVRU2SnkErj6IsukL8uFdezm-Ql6UjePzBgcv0pfqNwGvKq4PL_DFmXtLPnBRV0u3phXlC-09cyw6BabHcN2hysERVw0MAhDssNpDrYcHkMXSU_UtH8eZJaQjLf4w-PTqYeMUUJK350-JI7fIivNvyHMJuC-X0m46Zp3e52KK0HV5_9Z9M0dqOIqh5jcMGj_p_YaGMhPBWVPg0aw",
    },
    {
      title: "Towing",
      description: "We'll tow your car to the nearest repair shop.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDC0zQBexUWX8pjqXI7QfvRj23aSaYOT6kJahrItSUDTlXgdGd0XKPdjvUudaLNcDsryBEZjaT2DslD7oivBGBPzE9w5ad5xDnaxm-QXlRX331pZ4-dn3jSj6hBVXea7lWO9uiOU9KNLLSQAsEcjxwqJGxp2lMdJZpgjNxdZ0HqsdxrnDMwXGYRG_ne79X0JbHpRNFeRYUXv6XuZ7KXY_Br0ESp_s_Kqj6Fq5p6nrkc9HP0sFx81wgNiq1WCgyV30ktrswm8PyI6w",
    },
    {
      title: "Dead Battery",
      description: "We'll jump-start your car or replace the battery.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC7302qobhJSDNf26Or8P2tLTW6cKilBBpKJl0rNwWwBRFXIeXHhrrCGrm3BJA0J3ZYWy6Uc0YzsiMHCXFVq-AAo5fXISSFKDKeVzBgfvkfh8wo37YWpKvry5iQxt03XwS2aMytfUpj0dMt8aDoJIvdkw3rWldoHEVaZGNJV9vO1N-SEeKZn-j-YBFd0m3AnPlenqcYBO3M48ZKikDqj-vFlOWBp7B6yQ6LrA7uSUrPrYanAWi540wotWzp_lof1kAriq1-fQ8RHw",
    },
    {
      title: "Other Services",
      description: "For any other issues, we're here to help.",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ7k6V9FIukanxZ4ZuV3jkhhJYnjckXKsSsQy8_ThyOHhGHnIx7fpG6PdMhbux9YeMolfQ2bPqBMZOOp7byhBH5IGUfcpl4AgNhcfqgHDZ8F61vE-1ocXq2-pCwuI8qmRkefU4EtNI_uNbV4rs0l5QNeNjqNH79wxTiO0ReQw_g9Mwb5FDOzGb5ujNR6q4z2y5CBh3q-rQ3w3tEWaTIoy-6_W8JPtpAbK2GfZo2QZYkpMEc-WSAc8aAB8YJdX2gVTs34fgyEDWwA",
    },
  ];

  return (
    <View className="flex-1 bg-[#f6f8f7] dark:bg-[#122018]">
      {/* Header */}
      <View className="p-4 flex-row items-center justify-between bg-[#f6f8f7]/80 dark:bg-[#122018]/80">
        <Text className="text-xl font-bold text-center flex-1 text-[#122018] dark:text-white">
          Mekanikus
        </Text>
        <TouchableOpacity className="w-12 h-12 items-center justify-center rounded-full bg-transparent">
          <MaterialIcons name="settings" size={26} color="#22dd6d" />
        </TouchableOpacity>
      </View>

      {/* Main */}
      <ScrollView
        className="flex-1 px-4 pb-40"
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <Text className="text-2xl font-bold mb-6 text-[#122018] dark:text-white">
          What's the issue?
        </Text>

        {services.map((item, index) => (
          <View
            key={index}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-md overflow-hidden mb-4"
          >
            <Image
              source={{ uri: item.image }}
              className="h-48 w-full object-cover rounded-t-xl"
            />
            <View className="p-6">
              <Text className="uppercase tracking-wide text-sm text-[#22dd6d] font-semibold">
                {item.title}
              </Text>
              <Text className="mt-2 text-gray-600 dark:text-gray-400">
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 bg-[#f6f8f7] dark:bg-[#122018] border-t border-[#22dd6d]/20 dark:border-[#22dd6d]/30">
        <View className="p-4">
          <TouchableOpacity
            className="w-full bg-[#22dd6d] py-4 px-5 rounded-xl shadow-lg items-center active:opacity-90"
            activeOpacity={0.9}
          >
            <Text className="font-bold text-[#122018]">Call Help Now</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Nav */}
        <View className="flex-row justify-around pb-3">
          <TouchableOpacity className="items-center gap-1">
            <MaterialIcons name="home" size={24} color="#22dd6d" />
            <Text className="text-xs font-medium text-[#22dd6d]">Home</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center gap-1">
            <MaterialIcons name="build" size={24} color="#888" />
            <Text className="text-xs font-medium text-[#888]">Services</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center gap-1">
            <MaterialIcons name="person" size={24} color="#888" />
            <Text className="text-xs font-medium text-[#888]">Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
