const { createApp, ref, onMounted, watch } = Vue;

createApp({
  setup() {
    const datas = ref([]);
    const filter = ref([]);
    const role = ref("");
    const level = ref("");
    const languages = ref([]);
    const loading = ref(false);

    onMounted(() => {
      fetch("../data.json")
        .then((response) => {
          if (!response.ok) {
            console.error("Network response was not ok");
            alert("Check your internet connection");
          }
          return response.json();
        })
        .then((data) => {
          datas.value = data;
          filter.value = data;
          loading.value = true;
        //   setTimeout(() => {
        //     loading.value = true;
        //   }, 1000);
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    });

    const applyFilter = async () => {
      filter.value = datas.value.filter((item) => {
        // Logika filter berdasarkan role, level, dan languages
        const roleMatch = role.value === "" || item.role === role.value;
        const levelMatch = level.value === "" || item.level === level.value;
        const languagesMatch =
          languages.value.length === 0 ||
          languages.value.every((lang) => item.languages.includes(lang));
        return roleMatch && levelMatch && languagesMatch;
      });
    };

    // Panggil applyFilter() ketika nilai role, level, atau languages berubah
    watch([role, level, languages], () => {
        loading.value = false;
        applyFilter();
        setTimeout(() => {
          loading.value = true;
        }, 500);
    });
    const roleClick = (v) => {
        if (role.value != v) {
            role.value = v;
        }
    };

    const levelClick = (v) => {
        if (level.value != v) {
            level.value = v;
        }
    };

    const languagesClick = (v) => {
        if (!languages.value.includes(v)) {
            const exampler = [...languages.value, v];
            languages.value = exampler;
        }
    };

    const clearFilter = () => {
        role.value = "";
        level.value = "";
        languages.value = [];
    };

    const clearLanguage = (v) => {
      const TryFilter = languages.value.filter((lang) => lang != v);
      languages.value = TryFilter;
    }

    return {
      filter,
      loading,
      roleClick,
      levelClick,
      languagesClick,
      role,
      level,
      languages,
      clearFilter,
      clearLanguage
    };
  },
}).mount("#app");
