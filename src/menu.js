export default [
  "Chung",
  [
    {
      to: "/home",
      icon: "home",
      label: "Trang chủ"
    },
    {
      to: "/order",
      icon: "table",
      label: "Khu vực bàn"
    }
  ],
  "Danh mục",
  [
    {
      to: "/attendance",
      label: "Bảng công",
      icon: "file-check-outline",
      updateMark: true
    },
    {
      to: "/forms",
      label: "Tài khoản nhân viên",
      icon: "square-edit-outline"
    },
    {
      label: "Đồ uống",
      subLabel: "Submenus Example",
      icon: "glass-cocktail",
      menu: [
        {
          to: "/category",
          label: "Loại đồ uống"
        },
        {
          to: "/item",
          label: "Danh sách đồ uống"
        }
      ]
    }
  ],
  "Nhân viên và khách hàng",
  [
    {
      to: "/employee",
      label: "Nhân viên",
      icon: "account",
    },
    {
      to: "/client",
      label: "Khách hàng",
      icon: "account-multiple",
    }
  ]
];
