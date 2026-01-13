/**
 * Admin Panel Responsive Utility Classes
 * Centralized responsive class definitions for consistent admin UI
 */

export const adminClasses = {
  // Container Classes
  container: "max-w-7xl mx-auto px-3 sm:px-4 lg:px-6",
  content: "space-y-4 sm:space-y-6",

  // Header Classes
  header: "flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-4 sm:mb-6",
  headerTitle: "min-w-0 flex-1",
  headerTitleText: "text-xl sm:text-2xl font-bold text-gray-900",
  headerSubtitle: "text-gray-600 text-sm sm:text-base mt-1",
  headerActions: "flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3",

  // Button Classes
  btn: "inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors",
  btnPrimary: "inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors bg-orange-600 text-white hover:bg-orange-700",
  btnSecondary: "inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors bg-gray-600 text-white hover:bg-gray-700",
  btnSuccess: "inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors bg-green-600 text-white hover:bg-green-700",
  btnDanger: "inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors bg-red-600 text-white hover:bg-red-700",
  btnOutline: "inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors border border-gray-300 text-gray-700 bg-white hover:bg-gray-50",

  // Card Classes
  card: "bg-white rounded-lg border border-gray-200 p-4 sm:p-6",
  cardCompact: "bg-white rounded-lg border border-gray-200 p-3 sm:p-4",

  // Grid Classes
  grid124: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6",
  grid123: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",
  grid12: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6",
  gridResponsive: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6",

  // Form Classes
  formGroup: "space-y-2",
  formRow: "flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4",
  input: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 text-sm sm:text-base",
  select: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 text-sm sm:text-base bg-white",
  textarea: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 text-sm sm:text-base resize-vertical min-h-[100px]",

  // Filter Classes
  filters: "bg-white rounded-lg border border-gray-200 p-4 sm:p-6",
  filtersRow: "flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4",
  search: "relative flex-1 sm:flex-none",
  searchInput: "w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 text-sm sm:text-base",
  searchIcon: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400",

  // Table Classes
  tableContainer: "overflow-x-auto",
  table: "min-w-full divide-y divide-gray-200",
  tableHeader: "bg-gray-50",
  tableHeaderCell: "px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  tableBody: "bg-white divide-y divide-gray-200",
  tableBodyCell: "px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900",

  // Pagination Classes
  pagination: "bg-white rounded-lg border border-gray-200 p-3 sm:p-4",
  paginationContainer: "flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0",
  paginationInfo: "text-xs sm:text-sm text-gray-700 text-center sm:text-left",
  paginationControls: "flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2",
  paginationBtn: "px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors",
  paginationBtnActive: "px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors bg-orange-600 text-white",
  paginationBtnInactive: "px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors text-gray-500 bg-white border border-gray-300 hover:bg-gray-50",

  // Stats Classes
  statsGrid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6",
  statCard: "bg-white rounded-lg border border-gray-200 p-3 sm:p-4",
  statContent: "flex items-center",
  statIcon: "p-2 rounded-lg flex-shrink-0",
  statInfo: "ml-3 sm:ml-4",
  statLabel: "text-xs sm:text-sm font-medium text-gray-600",
  statValue: "text-xl sm:text-2xl font-bold text-gray-900",

  // Modal Classes
  modalOverlay: "fixed inset-0 z-50 overflow-y-auto",
  modalBackdrop: "fixed inset-0 bg-black/50 backdrop-blur-sm",
  modalContainer: "flex min-h-full items-center justify-center p-4",
  modalContent: "relative bg-white rounded-lg shadow-xl max-w-md sm:max-w-lg lg:max-w-2xl xl:max-w-4xl w-full max-h-[90vh] overflow-y-auto",
  modalHeader: "px-4 sm:px-6 py-4 border-b border-gray-200",
  modalBody: "px-4 sm:px-6 py-4",
  modalFooter: "px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3",

  // Sidebar Classes
  sidebar: "bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-30 h-screen",
  sidebarMobile: "fixed left-0 top-0 translate-x-0",
  sidebarDesktop: "lg:relative lg:translate-x-0 lg:left-auto lg:top-auto",
  sidebarCollapsed: "w-16",
  sidebarExpanded: "w-64",

  // Text Classes
  textResponsive: "text-sm sm:text-base",
  textSmallResponsive: "text-xs sm:text-sm",
  headingResponsive: "text-lg sm:text-xl lg:text-2xl",

  // Spacing Classes
  spacingY: "space-y-3 sm:space-y-4 lg:space-y-6",
  spacingX: "space-x-2 sm:space-x-3 lg:space-x-4",
  padding: "p-3 sm:p-4 lg:p-6",
  paddingX: "px-3 sm:px-4 lg:px-6",
  paddingY: "py-3 sm:py-4 lg:py-6",

  // Utility Classes
  hideMobile: "hidden sm:block",
  hideDesktop: "block sm:hidden",
  truncate: "truncate",
  flexResponsive: "flex flex-col sm:flex-row",
  itemsResponsive: "items-start sm:items-center",
  justifyResponsive: "justify-start sm:justify-between",

  // Tab Classes
  tabContainer: "bg-white rounded-lg border border-gray-200",
  tabList: "flex flex-col sm:flex-row border-b border-gray-200",
  tabScrollContainer: "flex overflow-x-auto sm:overflow-visible",
  tab: "py-3 px-4 sm:px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors",
  tabActive: "py-3 px-4 sm:px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors border-orange-500 text-orange-600 bg-orange-50",
  tabInactive: "py-3 px-4 sm:px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50",
  tabContent: "p-4 sm:p-6",

  // List Classes
  list: "space-y-4",
  listItem: "bg-white border border-gray-200 rounded-lg",
  listItemHeader: "p-3 sm:p-4 border-b border-gray-100",
  listItemContent: "p-3 sm:p-4",
  listItemActions: "flex flex-col sm:flex-row sm:items-center gap-2",

  // Badge Classes
  badge: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
  badgeSuccess: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800",
  badgeWarning: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800",
  badgeDanger: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800",
  badgeInfo: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800",

  // Icon Classes
  icon: "h-4 w-4",
  iconLarge: "h-5 w-5 sm:h-6 sm:w-6",
  iconButton: "p-2 rounded-lg hover:bg-gray-100 transition-colors",
};

// Helper function to combine classes
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Responsive breakpoint utilities
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Common responsive patterns
export const responsivePatterns = {
  // Stack on mobile, row on desktop
  stackToRow: "flex flex-col sm:flex-row",
  
  // Center on mobile, space between on desktop
  centerToSpaceBetween: "flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0",
  
  // Full width on mobile, auto on desktop
  fullToAuto: "w-full sm:w-auto",
  
  // Hidden on mobile, visible on desktop
  hiddenToVisible: "hidden sm:block",
  
  // Visible on mobile, hidden on desktop
  visibleToHidden: "block sm:hidden",
  
  // Small text on mobile, normal on desktop
  smallToNormal: "text-sm sm:text-base",
  
  // Compact padding on mobile, normal on desktop
  compactToNormal: "p-3 sm:p-4 lg:p-6",
  
  // Single column on mobile, multiple on desktop
  singleToMultiple: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};
