/* eslint-disable @typescript-eslint/interface-name-prefix */
export interface INewMemo {
  DisplayName: string
  Description: string
}

export interface IAddNew {
  show: boolean
  onCreate: (memo: INewMemo) => void
  onClose: () => void
}
